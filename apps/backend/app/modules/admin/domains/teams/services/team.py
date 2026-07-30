import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.organization.events.events import TeamCreated
from app.modules.admin.domains.teams.models.team import Team
from app.modules.admin.domains.teams.repositories.team import TeamRepository
from app.modules.admin.domains.teams.schemas.schemas import (
    TeamCreateRequest,
    TeamUpdateRequest,
)


class TeamService:
    def __init__(self, repo: TeamRepository, dept_repo: DepartmentRepository):
        self.repo = repo
        self.dept_repo = dept_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Team).where(
            Team.company_id == company_id,
            Team.code == code,
            Team.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Team.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active team code '{code}'",
                )

    async def create_team(
        self,
        company_id: uuid.UUID,
        payload: TeamCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Team:
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        parent = await self.dept_repo.get_by_id_with_tenant(
            company_id, payload.department_id
        )
        if not parent:
            raise NotFoundException(
                "DEPARTMENT_NOT_FOUND", "Parent department not found"
            )

        team = Team(
            company_id=company_id,
            department_id=payload.department_id,
            name=payload.name,
            code=payload.code,
            description=payload.description,
            lead_placeholder=payload.lead_placeholder,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(team)
        await publish_admin_event(
            TeamCreated(
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

    async def update_team(
        self,
        company_id: uuid.UUID,
        team_id: uuid.UUID,
        payload: TeamUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Team:
        team = await self.repo.get_by_id_with_tenant(company_id, team_id)
        if not team:
            raise NotFoundException("TEAM_NOT_FOUND", "Team not found")

        if (
            payload.department_id is not None
            and payload.department_id != team.department_id
        ):
            parent = await self.dept_repo.get_by_id_with_tenant(
                company_id, payload.department_id
            )
            if not parent:
                raise NotFoundException(
                    "DEPARTMENT_NOT_FOUND", "Parent department not found"
                )
            team.department_id = payload.department_id

        # Date validations
        ef = payload.effective_from or team.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else team.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or team.code, ef, et, team_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["department_id"]:
                setattr(team, k, v)

        team.updated_by = actor_id
        team.updated_at = datetime.now(UTC).replace(tzinfo=None)

        return await self.repo.create(team)

    async def delete_team(
        self,
        company_id: uuid.UUID,
        team_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        team = await self.repo.get_by_id_with_tenant(company_id, team_id)
        if not team:
            raise NotFoundException("TEAM_NOT_FOUND", "Team not found")
        team.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        team.is_active = False
        team.updated_by = actor_id
        await self.repo.create(team)
