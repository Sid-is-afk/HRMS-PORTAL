import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.departments.models.department import Department
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.departments.schemas.schemas import (
    DepartmentCreateRequest,
    DepartmentUpdateRequest,
)
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.organization.events.events import (
    DepartmentArchived,
    DepartmentCreated,
    DepartmentUpdated,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository


class DepartmentService:
    def __init__(
        self,
        repo: DepartmentRepository,
        div_repo: DivisionRepository,
        team_repo: TeamRepository,
    ):
        self.repo = repo
        self.div_repo = div_repo
        self.team_repo = team_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Department).where(
            Department.company_id == company_id,
            Department.code == code,
            Department.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Department.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active department code '{code}'",
                )

    async def create_department(
        self,
        company_id: uuid.UUID,
        payload: DepartmentCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Department:
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        parent = await self.div_repo.get_by_id_with_tenant(
            company_id, payload.division_id
        )
        if not parent:
            raise NotFoundException("DIVISION_NOT_FOUND", "Parent division not found")

        dept = Department(
            company_id=company_id,
            division_id=payload.division_id,
            name=payload.name,
            code=payload.code,
            description=payload.description,
            head_placeholder=payload.head_placeholder,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(dept)
        await publish_admin_event(
            DepartmentCreated(
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

    async def update_department(
        self,
        company_id: uuid.UUID,
        department_id: uuid.UUID,
        payload: DepartmentUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Department:
        dept = await self.repo.get_by_id_with_tenant(company_id, department_id)
        if not dept:
            raise NotFoundException("DEPARTMENT_NOT_FOUND", "Department not found")

        if payload.division_id is not None and payload.division_id != dept.division_id:
            parent = await self.div_repo.get_by_id_with_tenant(
                company_id, payload.division_id
            )
            if not parent:
                raise NotFoundException(
                    "DIVISION_NOT_FOUND", "Parent division not found"
                )
            dept.division_id = payload.division_id

        # Date validations
        ef = payload.effective_from or dept.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else dept.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or dept.code, ef, et, department_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["division_id"]:
                setattr(dept, k, v)

        dept.updated_by = actor_id
        dept.updated_at = datetime.now(UTC).replace(tzinfo=None)

        updated = await self.repo.create(dept)

        if payload.is_active is False:
            await self._cascade_deactivate(department_id)
            await publish_admin_event(
                DepartmentArchived(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"id": str(department_id)},
                )
            )
        else:
            await publish_admin_event(
                DepartmentUpdated(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"id": str(department_id)},
                )
            )

        return updated

    async def _cascade_deactivate(self, department_id: uuid.UUID) -> None:
        team_stmt = select(self.team_repo.model).where(
            self.team_repo.model.department_id == department_id,
            self.team_repo.model.deleted_at.is_(None),
        )
        teams = (await self.repo.session.execute(team_stmt)).scalars().all()
        for team in teams:
            team.is_active = False
            await self.team_repo.create(team)

    async def delete_department(
        self,
        company_id: uuid.UUID,
        department_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        dept = await self.repo.get_by_id_with_tenant(company_id, department_id)
        if not dept:
            raise NotFoundException("DEPARTMENT_NOT_FOUND", "Department not found")
        dept.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        dept.is_active = False
        dept.updated_by = actor_id
        await self.repo.create(dept)
        await publish_admin_event(
            DepartmentArchived(
                company_id=company_id,
                actor_id=actor_id,
                payload={"id": str(department_id)},
            )
        )
