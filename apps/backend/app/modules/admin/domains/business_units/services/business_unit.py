import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.business_units.models.business_unit import BusinessUnit
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.business_units.schemas.schemas import (
    BusinessUnitCreateRequest,
    BusinessUnitUpdateRequest,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.organization.events.events import BusinessUnitCreated
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository


class BusinessUnitService:
    def __init__(
        self,
        repo: BusinessUnitRepository,
        org_repo: OrganizationRepository,
        div_repo: DivisionRepository,
        dept_repo: DepartmentRepository,
        team_repo: TeamRepository,
    ):
        self.repo = repo
        self.org_repo = org_repo
        self.div_repo = div_repo
        self.dept_repo = dept_repo
        self.team_repo = team_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(BusinessUnit).where(
            BusinessUnit.company_id == company_id,
            BusinessUnit.code == code,
            BusinessUnit.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(BusinessUnit.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active business unit code '{code}'",
                )

    async def create_business_unit(
        self,
        company_id: uuid.UUID,
        payload: BusinessUnitCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> BusinessUnit:
        # Check overlaps
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        # Parent validation
        parent = await self.org_repo.get_by_id_with_tenant(
            company_id, payload.organization_id
        )
        if not parent:
            raise NotFoundException(
                "ORGANIZATION_NOT_FOUND", "Parent organization not found"
            )

        bu = BusinessUnit(
            company_id=company_id,
            organization_id=payload.organization_id,
            name=payload.name,
            code=payload.code,
            description=payload.description,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(bu)
        await publish_admin_event(
            BusinessUnitCreated(
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

    async def update_business_unit(
        self,
        company_id: uuid.UUID,
        business_unit_id: uuid.UUID,
        payload: BusinessUnitUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> BusinessUnit:
        bu = await self.repo.get_by_id_with_tenant(company_id, business_unit_id)
        if not bu:
            raise NotFoundException(
                "BUSINESS_UNIT_NOT_FOUND", "Business unit not found"
            )

        if (
            payload.organization_id is not None
            and payload.organization_id != bu.organization_id
        ):
            parent = await self.org_repo.get_by_id_with_tenant(
                company_id, payload.organization_id
            )
            if not parent:
                raise NotFoundException(
                    "ORGANIZATION_NOT_FOUND", "Parent organization not found"
                )
            bu.organization_id = payload.organization_id

        # Date validations
        ef = payload.effective_from or bu.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else bu.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or bu.code, ef, et, business_unit_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["organization_id"]:
                setattr(bu, k, v)

        bu.updated_by = actor_id
        bu.updated_at = datetime.now(UTC).replace(tzinfo=None)

        updated = await self.repo.create(bu)

        if payload.is_active is False:
            await self._cascade_deactivate(business_unit_id)

        return updated

    async def _cascade_deactivate(self, business_unit_id: uuid.UUID) -> None:
        div_stmt = select(self.div_repo.model).where(
            self.div_repo.model.business_unit_id == business_unit_id,
            self.div_repo.model.deleted_at.is_(None),
        )
        divs = (await self.repo.session.execute(div_stmt)).scalars().all()
        for div in divs:
            div.is_active = False
            await self.div_repo.create(div)

            dept_stmt = select(self.dept_repo.model).where(
                self.dept_repo.model.division_id == div.id,
                self.dept_repo.model.deleted_at.is_(None),
            )
            depts = (await self.repo.session.execute(dept_stmt)).scalars().all()
            for dept in depts:
                dept.is_active = False
                await self.dept_repo.create(dept)

                team_stmt = select(self.team_repo.model).where(
                    self.team_repo.model.department_id == dept.id,
                    self.team_repo.model.deleted_at.is_(None),
                )
                teams = (await self.repo.session.execute(team_stmt)).scalars().all()
                for team in teams:
                    team.is_active = False
                    await self.team_repo.create(team)

    async def delete_business_unit(
        self,
        company_id: uuid.UUID,
        business_unit_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        bu = await self.repo.get_by_id_with_tenant(company_id, business_unit_id)
        if not bu:
            raise NotFoundException(
                "BUSINESS_UNIT_NOT_FOUND", "Business unit not found"
            )
        bu.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        bu.is_active = False
        bu.updated_by = actor_id
        await self.repo.create(bu)
