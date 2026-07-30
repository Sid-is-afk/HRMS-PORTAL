import uuid
from datetime import UTC, date, datetime, timedelta
from typing import Any

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions.base import BusinessException
from app.core.security.hashing import get_password_hash
from app.core.security.jwt import create_access_token
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.business_units.schemas.schemas import (
    BusinessUnitCreateRequest,
)
from app.modules.admin.domains.business_units.services.business_unit import (
    BusinessUnitService,
)
from app.modules.admin.domains.cost_centers.repositories.cost_center import (
    CostCenterRepository,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.departments.schemas.schemas import (
    DepartmentCreateRequest,
)
from app.modules.admin.domains.departments.services.department import DepartmentService
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.divisions.schemas.schemas import DivisionCreateRequest
from app.modules.admin.domains.divisions.services.division import DivisionService
from app.modules.admin.domains.locations.repositories.location import LocationRepository

# Import repositories
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)

# Import schemas
from app.modules.admin.domains.organization.schemas.schemas import (
    OrganizationCreateRequest,
    OrganizationUpdateRequest,
)

# Import services
from app.modules.admin.domains.organization.services.organization import (
    OrganizationService,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository
from app.modules.admin.domains.teams.schemas.schemas import TeamCreateRequest
from app.modules.admin.domains.teams.services.team import TeamService
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.roles.models.role import (
    Role,
    role_permissions,
    user_roles,
)
from app.modules.auth.domains.sessions.models.session import Session
from app.modules.auth.domains.users.models.user import User


@pytest.fixture
async def auth_setup(db_session: AsyncSession) -> dict[str, Any]:
    company_id = uuid.uuid4()

    # 1. Create permissions
    perms = {}
    for perm_name in [
        "organization:create",
        "organization:read",
        "organization:update",
        "organization:delete",
        "department:create",
        "department:update",
        "designation:create",
        "designation:update",
        "location:create",
        "location:update",
    ]:
        perm = Permission(name=perm_name, description=f"Permission for {perm_name}")
        db_session.add(perm)
        perms[perm_name] = perm
    await db_session.flush()

    # 2. Create role
    role = Role(name="Admin Director", description="Admin Management Role")
    db_session.add(role)
    await db_session.flush()

    # 3. Associate permissions to role
    for perm in perms.values():
        await db_session.execute(
            role_permissions.insert().values(role_id=role.id, permission_id=perm.id)
        )

    # 4. Create identity
    identity = Identity(
        email="admin@enterprise.com",
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
        display_name="Admin Manager",
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
        }
    )
    headers = {"Authorization": f"Bearer {token}"}

    return {
        "company_id": company_id,
        "identity_id": identity.id,
        "user_id": user.id,
        "headers": headers,
    }


@pytest.mark.asyncio
async def test_organization_cycle_detection(
    db_session: AsyncSession, auth_setup: dict[str, Any]
) -> None:
    company_id = auth_setup["company_id"]
    actor_id = auth_setup["user_id"]

    org_service = OrganizationService(
        repo=OrganizationRepository(db_session),
        bu_repo=BusinessUnitRepository(db_session),
        div_repo=DivisionRepository(db_session),
        dept_repo=DepartmentRepository(db_session),
        team_repo=TeamRepository(db_session),
        branch_repo=BranchRepository(db_session),
        loc_repo=LocationRepository(db_session),
        cc_repo=CostCenterRepository(db_session),
    )

    # Create root org
    root = await org_service.create_organization(
        company_id,
        OrganizationCreateRequest(
            name="Root Corp",
            code="ROOT",
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )

    # Create child org
    child = await org_service.create_organization(
        company_id,
        OrganizationCreateRequest(
            name="Child Corp",
            code="CHILD",
            parent_organization_id=root.id,
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )

    # Try setting root's parent to child (should fail with CIRCULAR_HIERARCHY)
    with pytest.raises(BusinessException) as exc_info:
        await org_service.update_organization(
            company_id,
            root.id,
            OrganizationUpdateRequest(parent_organization_id=child.id),
            actor_id,
        )
    assert exc_info.value.code == "CIRCULAR_HIERARCHY"


@pytest.mark.asyncio
async def test_effective_dating_overlap_validation(
    db_session: AsyncSession, auth_setup: dict[str, Any]
) -> None:
    company_id = auth_setup["company_id"]
    actor_id = auth_setup["user_id"]

    org_service = OrganizationService(
        repo=OrganizationRepository(db_session),
        bu_repo=BusinessUnitRepository(db_session),
        div_repo=DivisionRepository(db_session),
        dept_repo=DepartmentRepository(db_session),
        team_repo=TeamRepository(db_session),
        branch_repo=BranchRepository(db_session),
        loc_repo=LocationRepository(db_session),
        cc_repo=CostCenterRepository(db_session),
    )

    # Create org valid from 2026-01-01 to 2026-06-30
    await org_service.create_organization(
        company_id,
        OrganizationCreateRequest(
            name="First Org",
            code="ORG-001",
            effective_from=date(2026, 1, 1),
            effective_to=date(2026, 6, 30),
        ),
        actor_id,
    )

    # Try creating org with same code overlapping (e.g. 2026-06-01 to 2026-12-31)
    with pytest.raises(BusinessException) as exc_info:
        await org_service.create_organization(
            company_id,
            OrganizationCreateRequest(
                name="Second Org",
                code="ORG-001",
                effective_from=date(2026, 6, 1),
                effective_to=date(2026, 12, 31),
            ),
            actor_id,
        )
    assert exc_info.value.code == "HIERARCHY_CONFLICT"


@pytest.mark.asyncio
async def test_cascading_deactivation(
    db_session: AsyncSession, auth_setup: dict[str, Any]
) -> None:
    company_id = auth_setup["company_id"]
    actor_id = auth_setup["user_id"]

    org_repo = OrganizationRepository(db_session)
    bu_repo = BusinessUnitRepository(db_session)
    div_repo = DivisionRepository(db_session)
    dept_repo = DepartmentRepository(db_session)
    team_repo = TeamRepository(db_session)
    branch_repo = BranchRepository(db_session)
    loc_repo = LocationRepository(db_session)
    cc_repo = CostCenterRepository(db_session)

    org_service = OrganizationService(
        org_repo,
        bu_repo,
        div_repo,
        dept_repo,
        team_repo,
        branch_repo,
        loc_repo,
        cc_repo,
    )
    bu_service = BusinessUnitService(bu_repo, org_repo, div_repo, dept_repo, team_repo)
    div_service = DivisionService(div_repo, bu_repo, dept_repo, team_repo)
    dept_service = DepartmentService(dept_repo, div_repo, team_repo)
    team_service = TeamService(team_repo, dept_repo)

    # 1. Setup hierarchy
    org = await org_service.create_organization(
        company_id,
        OrganizationCreateRequest(
            name="Enterprise", code="ENT", effective_from=date(2026, 1, 1)
        ),
        actor_id,
    )
    bu = await bu_service.create_business_unit(
        company_id,
        BusinessUnitCreateRequest(
            organization_id=org.id,
            name="Retail BU",
            code="RET",
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )
    div = await div_service.create_division(
        company_id,
        DivisionCreateRequest(
            business_unit_id=bu.id,
            name="North Div",
            code="NDIV",
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )
    dept = await dept_service.create_department(
        company_id,
        DepartmentCreateRequest(
            division_id=div.id,
            name="Sales Dept",
            code="SDEPT",
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )
    team = await team_service.create_team(
        company_id,
        TeamCreateRequest(
            department_id=dept.id,
            name="Inbound Team",
            code="ITEAM",
            effective_from=date(2026, 1, 1),
        ),
        actor_id,
    )

    # 2. Deactivate Organization
    await org_service.update_organization(
        company_id,
        org.id,
        OrganizationUpdateRequest(is_active=False),
        actor_id,
    )

    # 3. Verify all children are deactivated
    updated_bu = await bu_repo.get_by_id(bu.id)
    updated_div = await div_repo.get_by_id(div.id)
    updated_dept = await dept_repo.get_by_id(dept.id)
    updated_team = await team_repo.get_by_id(team.id)

    assert updated_bu is not None
    assert updated_bu.is_active is False
    assert updated_div is not None
    assert updated_div.is_active is False
    assert updated_dept is not None
    assert updated_dept.is_active is False
    assert updated_team is not None
    assert updated_team.is_active is False


@pytest.mark.asyncio
async def test_admin_api_endpoints_crud_flow(
    client: AsyncClient, auth_setup: dict[str, Any]
) -> None:
    headers = auth_setup["headers"]

    # 1. Create Org
    payload_org = {
        "name": "Global Holding",
        "code": "GHOLD",
        "effective_from": "2026-01-01",
        "is_active": True,
    }
    res = await client.post("/api/v1/organizations", json=payload_org, headers=headers)
    assert res.status_code == 201
    org_id = res.json()["data"]["id"]

    # 2. Get Org
    res = await client.get(f"/api/v1/organizations/{org_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["data"]["code"] == "GHOLD"

    # 3. Create Business Unit under Org
    payload_bu = {
        "organization_id": org_id,
        "name": "Finance BU",
        "code": "FINBU",
        "effective_from": "2026-01-01",
    }
    res = await client.post("/api/v1/business-units", json=payload_bu, headers=headers)
    assert res.status_code == 201
    bu_id = res.json()["data"]["id"]

    # 4. Search and paginate Business Units
    res = await client.get(
        "/api/v1/business-units?search=Finance&page=1&size=5", headers=headers
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) == 1
    assert data[0]["id"] == bu_id

    # 5. Delete Business Unit
    res = await client.delete(f"/api/v1/business-units/{bu_id}", headers=headers)
    assert res.status_code == 204
