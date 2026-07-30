import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.cost_centers.repositories.cost_center import (
    CostCenterRepository,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.organization.events.events import (
    OrganizationArchived,
    OrganizationCreated,
    OrganizationRestructured,
    OrganizationUpdated,
)
from app.modules.admin.domains.organization.models.organization import Organization
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.admin.domains.organization.schemas.schemas import (
    OrganizationCreateRequest,
    OrganizationUpdateRequest,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository


class OrganizationService:
    def __init__(
        self,
        repo: OrganizationRepository,
        bu_repo: BusinessUnitRepository,
        div_repo: DivisionRepository,
        dept_repo: DepartmentRepository,
        team_repo: TeamRepository,
        branch_repo: BranchRepository,
        loc_repo: LocationRepository,
        cc_repo: CostCenterRepository,
    ):
        self.repo = repo
        self.bu_repo = bu_repo
        self.div_repo = div_repo
        self.dept_repo = dept_repo
        self.team_repo = team_repo
        self.branch_repo = branch_repo
        self.loc_repo = loc_repo
        self.cc_repo = cc_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Organization).where(
            Organization.company_id == company_id,
            Organization.code == code,
            Organization.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Organization.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            # Overlap check
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active organization code '{code}'",
                )

    async def _detect_cycle(
        self, organization_id: uuid.UUID, parent_id: uuid.UUID
    ) -> None:
        curr_id: uuid.UUID | None = parent_id
        visited = set()
        while curr_id:
            if curr_id == organization_id:
                raise BusinessException(
                    "CIRCULAR_HIERARCHY",
                    "Circular reference detected in organization parentage",
                )
            if curr_id in visited:
                break
            visited.add(curr_id)
            parent = await self.repo.get_by_id(curr_id)
            if not parent:
                break
            curr_id = parent.parent_organization_id

    async def create_organization(
        self,
        company_id: uuid.UUID,
        payload: OrganizationCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Organization:
        # Check overlaps
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        # Parent validation
        if payload.parent_organization_id:
            parent = await self.repo.get_by_id(payload.parent_organization_id)
            if (
                not parent
                or parent.company_id != company_id
                or parent.deleted_at is not None
            ):
                raise NotFoundException(
                    "INVALID_PARENT", "Parent organization not found"
                )

        org = Organization(
            company_id=company_id,
            name=payload.name,
            code=payload.code,
            org_type=payload.org_type,
            description=payload.description,
            status=payload.status,
            parent_organization_id=payload.parent_organization_id,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(org)
        await publish_admin_event(
            OrganizationCreated(
                company_id=company_id,
                actor_id=actor_id,
                payload={
                    "id": str(created.id),
                    "code": created.code,
                    "name": created.name,
                },
            )
        )
        return created

    async def update_organization(
        self,
        company_id: uuid.UUID,
        organization_id: uuid.UUID,
        payload: OrganizationUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Organization:
        org = await self.repo.get_by_id_with_tenant(company_id, organization_id)
        if not org:
            raise NotFoundException("ORGANIZATION_NOT_FOUND", "Organization not found")

        # Parent check and circular check
        parent_changed = False
        if (
            payload.parent_organization_id is not None
            and payload.parent_organization_id != org.parent_organization_id
        ):
            await self._detect_cycle(organization_id, payload.parent_organization_id)
            parent = await self.repo.get_by_id(payload.parent_organization_id)
            if (
                not parent
                or parent.company_id != company_id
                or parent.deleted_at is not None
            ):
                raise NotFoundException(
                    "INVALID_PARENT", "Parent organization not found"
                )
            org.parent_organization_id = payload.parent_organization_id
            parent_changed = True

        # Date validations
        ef = payload.effective_from or org.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else org.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or org.code, ef, et, organization_id
            )

        # Update columns
        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["parent_organization_id"]:
                setattr(org, k, v)

        org.updated_by = actor_id
        org.updated_at = datetime.now(UTC).replace(tzinfo=None)

        updated = await self.repo.create(org)

        # Cascading deactivation
        if payload.is_active is False:
            await self._cascade_deactivate(company_id, organization_id)
            await publish_admin_event(
                OrganizationArchived(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"id": str(organization_id)},
                )
            )
        else:
            await publish_admin_event(
                OrganizationUpdated(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"id": str(organization_id)},
                )
            )

        if parent_changed:
            await publish_admin_event(
                OrganizationRestructured(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"id": str(organization_id)},
                )
            )

        return updated

    async def _cascade_deactivate(
        self, company_id: uuid.UUID, organization_id: uuid.UUID
    ) -> None:
        # Cascade deactivation to sub-orgs
        sub_orgs_stmt = select(Organization).where(
            Organization.company_id == company_id,
            Organization.parent_organization_id == organization_id,
            Organization.deleted_at.is_(None),
        )
        res = await self.repo.session.execute(sub_orgs_stmt)
        sub_orgs = res.scalars().all()
        for so in sub_orgs:
            so.is_active = False
            await self.repo.create(so)
            await self._cascade_deactivate(company_id, so.id)

        # Deactivate BusinessUnits
        bu_stmt = select(self.bu_repo.model).where(
            self.bu_repo.model.organization_id == organization_id,
            self.bu_repo.model.deleted_at.is_(None),
        )
        bus = (await self.repo.session.execute(bu_stmt)).scalars().all()
        for bu in bus:
            bu.is_active = False
            await self.bu_repo.create(bu)

            # Deactivate Divisions
            div_stmt = select(self.div_repo.model).where(
                self.div_repo.model.business_unit_id == bu.id,
                self.div_repo.model.deleted_at.is_(None),
            )
            divs = (await self.repo.session.execute(div_stmt)).scalars().all()
            for div in divs:
                div.is_active = False
                await self.div_repo.create(div)

                # Deactivate Departments
                dept_stmt = select(self.dept_repo.model).where(
                    self.dept_repo.model.division_id == div.id,
                    self.dept_repo.model.deleted_at.is_(None),
                )
                depts = (await self.repo.session.execute(dept_stmt)).scalars().all()
                for dept in depts:
                    dept.is_active = False
                    await self.dept_repo.create(dept)

                    # Deactivate Teams
                    team_stmt = select(self.team_repo.model).where(
                        self.team_repo.model.department_id == dept.id,
                        self.team_repo.model.deleted_at.is_(None),
                    )
                    teams = (await self.repo.session.execute(team_stmt)).scalars().all()
                    for team in teams:
                        team.is_active = False
                        await self.team_repo.create(team)

        # Deactivate Branches
        branch_stmt = select(self.branch_repo.model).where(
            self.branch_repo.model.organization_id == organization_id,
            self.branch_repo.model.deleted_at.is_(None),
        )
        branches = (await self.repo.session.execute(branch_stmt)).scalars().all()
        for b in branches:
            b.is_active = False
            await self.branch_repo.create(b)

            # Deactivate Locations
            loc_stmt = select(self.loc_repo.model).where(
                self.loc_repo.model.branch_id == b.id,
                self.loc_repo.model.deleted_at.is_(None),
            )
            locs = (await self.repo.session.execute(loc_stmt)).scalars().all()
            for loc in locs:
                loc.is_active = False
                await self.loc_repo.create(loc)

        # Deactivate CostCenters
        cc_stmt = select(self.cc_repo.model).where(
            self.cc_repo.model.organization_id == organization_id,
            self.cc_repo.model.deleted_at.is_(None),
        )
        ccs = (await self.repo.session.execute(cc_stmt)).scalars().all()
        for cc in ccs:
            cc.is_active = False
            await self.cc_repo.create(cc)

    async def delete_organization(
        self,
        company_id: uuid.UUID,
        organization_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        org = await self.repo.get_by_id_with_tenant(company_id, organization_id)
        if not org:
            raise NotFoundException("ORGANIZATION_NOT_FOUND", "Organization not found")
        org.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        org.is_active = False
        org.updated_by = actor_id
        await self.repo.create(org)
        await publish_admin_event(
            OrganizationArchived(
                company_id=company_id,
                actor_id=actor_id,
                payload={"id": str(organization_id)},
            )
        )
