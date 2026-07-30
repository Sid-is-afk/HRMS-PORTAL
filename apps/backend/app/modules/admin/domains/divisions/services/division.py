import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.divisions.models.division import Division
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.divisions.schemas.schemas import (
    DivisionCreateRequest,
    DivisionUpdateRequest,
)
from app.modules.admin.domains.organization.events.events import DivisionCreated
from app.modules.admin.domains.teams.repositories.team import TeamRepository


class DivisionService:
    def __init__(
        self,
        repo: DivisionRepository,
        bu_repo: BusinessUnitRepository,
        dept_repo: DepartmentRepository,
        team_repo: TeamRepository,
    ):
        self.repo = repo
        self.bu_repo = bu_repo
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
        stmt = select(Division).where(
            Division.company_id == company_id,
            Division.code == code,
            Division.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Division.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active division code '{code}'",
                )

    async def create_division(
        self,
        company_id: uuid.UUID,
        payload: DivisionCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Division:
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        parent = await self.bu_repo.get_by_id_with_tenant(
            company_id, payload.business_unit_id
        )
        if not parent:
            raise NotFoundException(
                "BUSINESS_UNIT_NOT_FOUND", "Parent business unit not found"
            )

        div = Division(
            company_id=company_id,
            business_unit_id=payload.business_unit_id,
            name=payload.name,
            code=payload.code,
            description=payload.description,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(div)
        await publish_admin_event(
            DivisionCreated(
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

    async def update_division(
        self,
        company_id: uuid.UUID,
        division_id: uuid.UUID,
        payload: DivisionUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Division:
        div = await self.repo.get_by_id_with_tenant(company_id, division_id)
        if not div:
            raise NotFoundException("DIVISION_NOT_FOUND", "Division not found")

        if (
            payload.business_unit_id is not None
            and payload.business_unit_id != div.business_unit_id
        ):
            parent = await self.bu_repo.get_by_id_with_tenant(
                company_id, payload.business_unit_id
            )
            if not parent:
                raise NotFoundException(
                    "BUSINESS_UNIT_NOT_FOUND", "Parent business unit not found"
                )
            div.business_unit_id = payload.business_unit_id

        # Date validations
        ef = payload.effective_from or div.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else div.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or div.code, ef, et, division_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["business_unit_id"]:
                setattr(div, k, v)

        div.updated_by = actor_id
        div.updated_at = datetime.now(UTC).replace(tzinfo=None)

        updated = await self.repo.create(div)

        if payload.is_active is False:
            await self._cascade_deactivate(division_id)

        return updated

    async def _cascade_deactivate(self, division_id: uuid.UUID) -> None:
        dept_stmt = select(self.dept_repo.model).where(
            self.dept_repo.model.division_id == division_id,
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

    async def delete_division(
        self,
        company_id: uuid.UUID,
        division_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        div = await self.repo.get_by_id_with_tenant(company_id, division_id)
        if not div:
            raise NotFoundException("DIVISION_NOT_FOUND", "Division not found")
        div.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        div.is_active = False
        div.updated_by = actor_id
        await self.repo.create(div)
