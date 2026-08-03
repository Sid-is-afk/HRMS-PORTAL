import uuid
from datetime import UTC, datetime, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.hashing import get_password_hash
from app.core.security.jwt import create_access_token
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.roles.models.role import (
    Role,
    role_permissions,
    user_roles,
)
from app.modules.auth.domains.sessions.models.session import Session
from app.modules.auth.domains.users.models.user import User
from app.modules.platform.domains.context_vars import (
    TenantContext,
    bypass_tenant_context,
)
from app.modules.platform.domains.context_vars import (
    current_tenant_context as tenant_context,
)
from app.modules.platform.domains.licensing.models.license import License
from app.modules.platform.domains.tenant.models.tenant import Tenant


@pytest.fixture
async def setup_platform_auth(db_session: AsyncSession) -> dict[str, str]:
    company_id = uuid.uuid4()

    # 1. Create platform administration permissions
    perms = {}
    perm_names = [
        "tenant:read",
        "tenant:create",
        "tenant:update",
        "license:manage",
        "feature:manage",
        "configuration:update",
        "platform:admin",
    ]
    for perm_name in perm_names:
        perm = Permission(name=perm_name, description=f"Permission for {perm_name}")
        db_session.add(perm)
        perms[perm_name] = perm
    await db_session.flush()

    # 2. Create platform admin role
    role = Role(name="Platform Admin", description="Platform Administration Role")
    db_session.add(role)
    await db_session.flush()

    # 3. Associate permissions to role
    for perm in perms.values():
        await db_session.execute(
            role_permissions.insert().values(role_id=role.id, permission_id=perm.id)
        )

    # 4. Create identity
    identity = Identity(
        email="platform-admin@enterprise.com",
        password_hash=get_password_hash("password123"),
        account_status="Active",
        email_verified=True,
    )
    db_session.add(identity)
    await db_session.flush()

    # 5. Create user
    user = User(
        identity_id=identity.id,
        company_id=company_id,
        display_name="Platform Administrator",
    )
    db_session.add(user)
    await db_session.flush()

    # 6. Associate user to role
    await db_session.execute(
        user_roles.insert().values(user_id=user.id, role_id=role.id)
    )

    # 7. Create session
    session = Session(
        identity_id=identity.id,
        is_active=True,
        expires_at=datetime.now(UTC).replace(tzinfo=None) + timedelta(days=1),
    )
    db_session.add(session)
    await db_session.flush()

    await db_session.commit()
    await db_session.refresh(identity)
    await db_session.refresh(user)

    # Generate token
    token = create_access_token(
        {
            "sub": str(identity.id),
            "sid": str(session.id),
            "tver": identity.token_version,
            "company_id": str(company_id),
            "roles": [role.name],
        }
    )

    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_tenant_lifecycle_and_provisioning(
    client: AsyncClient, setup_platform_auth: dict[str, str], db_session: AsyncSession
) -> None:
    # 1. Create a Tenant
    payload = {
        "tenant_code": "acme",
        "tenant_name": "Acme Industries",
        "subscription_plan": "Standard",
    }

    response = await client.post(
        "/api/v1/platform/tenants", json=payload, headers=setup_platform_auth
    )
    assert response.status_code == 201
    tenant_data = response.json()["data"]
    assert tenant_data["tenant_code"] == "acme"
    tenant_id = uuid.UUID(tenant_data["id"])

    # 2. Trigger Environment Provisioning
    prov_payload = {"tenant_id": str(tenant_id)}
    prov_response = await client.post(
        "/api/v1/platform/provision", json=prov_payload, headers=setup_platform_auth
    )
    assert prov_response.status_code == 200
    prov_data = prov_response.json()["data"]
    assert prov_data["status"] == "Completed"
    assert len(prov_data["histories"]) > 0

    # 3. Verify created details in Tenant list
    list_resp = await client.get(
        "/api/v1/platform/tenants", headers=setup_platform_auth
    )
    assert list_resp.status_code == 200
    list_data = list_resp.json()["data"]
    assert any(t["tenant_code"] == "acme" for t in list_data)


@pytest.mark.asyncio
async def test_licensing_and_limit_validation(
    client: AsyncClient, setup_platform_auth: dict[str, str], db_session: AsyncSession
) -> None:
    # Create tenant first
    tenant = Tenant(
        tenant_code="testing",
        tenant_name="Testing Org",
        subscription_plan="Free",
        status="Active",
        provisioning_status="Completed",
    )
    db_session.add(tenant)
    await db_session.flush()
    await db_session.commit()

    # Assign License
    lic_payload = {
        "tenant_id": str(tenant.id),
        "plan": "Enterprise",
        "user_limits": 5,
        "storage_limits": 500,
        "api_limits": 10000,
        "features": {"allow_ai": True},
    }

    response = await client.post(
        "/api/v1/platform/licenses", json=lic_payload, headers=setup_platform_auth
    )
    assert response.status_code == 200
    lic_data = response.json()["data"]
    assert lic_data["plan"] == "Enterprise"
    assert lic_data["user_limits"] == 5

    # Get active license
    get_resp = await client.get(
        f"/api/v1/platform/licenses?tenant_id={tenant.id}", headers=setup_platform_auth
    )
    assert get_resp.status_code == 200
    assert get_resp.json()["data"]["plan"] == "Enterprise"


@pytest.mark.asyncio
async def test_feature_flags_and_configurations(
    client: AsyncClient, setup_platform_auth: dict[str, str], db_session: AsyncSession
) -> None:
    # Create global feature flag
    flag_payload = {
        "key": "enable_beta_v2",
        "is_enabled": True,
        "is_global": True,
        "rollout_percentage": 100,
    }

    response = await client.patch(
        "/api/v1/platform/features", json=flag_payload, headers=setup_platform_auth
    )
    assert response.status_code == 200
    flag_data = response.json()["data"]
    assert flag_data["key"] == "enable_beta_v2"
    assert flag_data["is_enabled"] is True

    # Create global configuration
    config_payload = {"key": "system_maintenance", "value": "false", "is_global": True}
    config_resp = await client.put(
        "/api/v1/platform/configuration",
        json=config_payload,
        headers=setup_platform_auth,
    )
    assert config_resp.status_code == 200
    config_data = config_resp.json()["data"]
    assert config_data["key"] == "system_maintenance"
    assert config_data["value"] == "false"


@pytest.mark.asyncio
async def test_tenant_context_isolation(
    client: AsyncClient, setup_platform_auth: dict[str, str], db_session: AsyncSession
) -> None:
    # Create two tenants
    tenant_a = Tenant(tenant_code="ta", tenant_name="Tenant A")
    tenant_b = Tenant(tenant_code="tb", tenant_name="Tenant B")
    db_session.add(tenant_a)
    db_session.add(tenant_b)
    await db_session.flush()

    # Create license for Tenant A under context A
    lic_a = License(tenant_id=tenant_a.id, plan="Standard")
    lic_b = License(tenant_id=tenant_b.id, plan="Premium")
    db_session.add(lic_a)
    db_session.add(lic_b)
    await db_session.flush()
    await db_session.commit()

    # Query with context A active
    token = tenant_context.set(TenantContext(tenant_id=tenant_a.id))
    try:
        stmt = select(License)
        res = await db_session.execute(stmt)
        licenses_scoped = list(res.scalars().all())
        # The query should automatically apply tenant isolation filter!
        assert len(licenses_scoped) == 1
        assert licenses_scoped[0].plan == "Standard"
    finally:
        tenant_context.reset(token)

    # Query with bypass_tenant_context active
    bypass_token = bypass_tenant_context.set(True)
    try:
        stmt = select(License)
        res = await db_session.execute(stmt)
        licenses_all = list(res.scalars().all())
        assert len(licenses_all) >= 2
    finally:
        bypass_tenant_context.reset(bypass_token)
