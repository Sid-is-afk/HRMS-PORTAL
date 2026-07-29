import uuid

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.hashing import get_password_hash, verify_password
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.roles.models.role import (
    Role,
    role_permissions,
    user_roles,
)
from app.modules.auth.domains.users.models.user import User


@pytest.mark.asyncio
async def test_password_hashing() -> None:
    password = "super-secure-password"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong-password", hashed) is False


@pytest.mark.asyncio
async def test_full_auth_flow(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. Setup seed data
    company_id = uuid.uuid4()

    identity = Identity(
        email="employee@company.com",
        password_hash=get_password_hash("secure-pass123"),
        account_status="Active",
        email_verified=True,
    )
    db_session.add(identity)
    await db_session.flush()

    user = User(
        identity_id=identity.id,
        company_id=company_id,
        display_name="John Doe",
    )
    db_session.add(user)
    await db_session.flush()

    # Create role and permissions
    permission = Permission(name="employee:read", description="Read employees")
    db_session.add(permission)
    await db_session.flush()

    role = Role(name="Employee", description="Standard employee role")
    db_session.add(role)
    await db_session.flush()

    # Map role permissions
    await db_session.execute(
        role_permissions.insert().values(role_id=role.id, permission_id=permission.id)
    )
    # Map user roles
    await db_session.execute(
        user_roles.insert().values(user_id=user.id, role_id=role.id)
    )

    await db_session.commit()

    # Refresh items
    await db_session.refresh(identity)
    await db_session.refresh(user)

    # 2. Test Login endpoint (Form submission)
    login_data = {
        "username": "employee@company.com",
        "password": "secure-pass123",
    }
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    res_json = response.json()
    assert "access_token" in res_json
    assert "refresh_token" in res_json
    access_token = res_json["access_token"]
    refresh_token = res_json["refresh_token"]

    # 3. Test Me endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = await client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200
    me_json = me_response.json()
    assert me_json["email"] == "employee@company.com"
    assert "Employee" in me_json["roles"]
    assert "employee:read" in me_json["permissions"]

    # 4. Test Roles and Permissions endpoints
    roles_res = await client.get("/api/v1/auth/roles", headers=headers)
    assert roles_res.status_code == 200
    assert "Employee" in roles_res.json()

    perms_res = await client.get("/api/v1/auth/permissions", headers=headers)
    assert perms_res.status_code == 200
    assert "employee:read" in perms_res.json()

    # 5. Test Sessions endpoint
    sessions_res = await client.get("/api/v1/auth/sessions", headers=headers)
    assert sessions_res.status_code == 200
    sessions_json = sessions_res.json()
    assert len(sessions_json) == 1
    session_id = sessions_json[0]["id"]

    # 6. Test Refresh Token endpoint
    refresh_data = {"refresh_token": refresh_token}
    refresh_res = await client.post("/api/v1/auth/refresh", json=refresh_data)
    assert refresh_res.status_code == 200
    refresh_json = refresh_res.json()
    assert "access_token" in refresh_json
    assert "refresh_token" in refresh_json
    new_access_token = refresh_json["access_token"]

    # 7. Test Delete Session endpoint
    new_headers = {"Authorization": f"Bearer {new_access_token}"}
    delete_res = await client.delete(
        f"/api/v1/auth/sessions/{session_id}", headers=new_headers
    )
    assert delete_res.status_code == 204

    # Verification: session is now inactive, token must be rejected with 401
    sessions_res_2 = await client.get("/api/v1/auth/sessions", headers=new_headers)
    assert sessions_res_2.status_code == 401
    assert sessions_res_2.json()["error"]["code"] == "SESSION_REVOKED"
