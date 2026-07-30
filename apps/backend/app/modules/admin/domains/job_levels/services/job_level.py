import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.job_levels.models.job_level import JobLevel
from app.modules.admin.domains.job_levels.repositories.job_level import (
    JobLevelRepository,
)
from app.modules.admin.domains.job_levels.schemas.schemas import (
    JobLevelCreateRequest,
    JobLevelUpdateRequest,
)
from app.modules.admin.domains.organization.events.events import JobLevelCreated


class JobLevelService:
    def __init__(self, repo: JobLevelRepository):
        self.repo = repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        name: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(JobLevel).where(
            JobLevel.company_id == company_id,
            JobLevel.name == name,
            JobLevel.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(JobLevel.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active job level name '{name}'",
                )

    async def create_job_level(
        self,
        company_id: uuid.UUID,
        payload: JobLevelCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> JobLevel:
        await self._check_overlaps(
            company_id, payload.name, payload.effective_from, payload.effective_to
        )

        jl = JobLevel(
            company_id=company_id,
            name=payload.name,
            hierarchy_order=payload.hierarchy_order,
            description=payload.description,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(jl)
        await publish_admin_event(
            JobLevelCreated(
                company_id=company_id,
                actor_id=actor_id,
                payload={"id": str(created.id), "name": created.name},
            )
        )
        return created

    async def update_job_level(
        self,
        company_id: uuid.UUID,
        job_level_id: uuid.UUID,
        payload: JobLevelUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> JobLevel:
        jl = await self.repo.get_by_id_with_tenant(company_id, job_level_id)
        if not jl:
            raise NotFoundException("JOB_LEVEL_NOT_FOUND", "Job level not found")

        # Date validations
        ef = payload.effective_from or jl.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else jl.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.name or jl.name, ef, et, job_level_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(jl, k, v)

        jl.updated_by = actor_id
        jl.updated_at = datetime.now(UTC).replace(tzinfo=None)

        return await self.repo.create(jl)

    async def delete_job_level(
        self,
        company_id: uuid.UUID,
        job_level_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        jl = await self.repo.get_by_id_with_tenant(company_id, job_level_id)
        if not jl:
            raise NotFoundException("JOB_LEVEL_NOT_FOUND", "Job level not found")
        jl.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        jl.is_active = False
        jl.updated_by = actor_id
        await self.repo.create(jl)
