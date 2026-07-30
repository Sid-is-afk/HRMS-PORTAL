import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.designations.models.designation import Designation
from app.modules.admin.domains.designations.repositories.designation import (
    DesignationRepository,
)
from app.modules.admin.domains.designations.schemas.schemas import (
    DesignationCreateRequest,
    DesignationUpdateRequest,
)
from app.modules.admin.domains.job_levels.repositories.job_level import (
    JobLevelRepository,
)
from app.modules.admin.domains.organization.events.events import DesignationCreated


class DesignationService:
    def __init__(self, repo: DesignationRepository, jl_repo: JobLevelRepository):
        self.repo = repo
        self.jl_repo = jl_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Designation).where(
            Designation.company_id == company_id,
            Designation.code == code,
            Designation.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Designation.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active designation code '{code}'",
                )

    async def create_designation(
        self,
        company_id: uuid.UUID,
        payload: DesignationCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Designation:
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        parent = await self.jl_repo.get_by_id_with_tenant(
            company_id, payload.job_level_id
        )
        if not parent:
            raise NotFoundException("JOB_LEVEL_NOT_FOUND", "Parent job level not found")

        des = Designation(
            company_id=company_id,
            job_level_id=payload.job_level_id,
            name=payload.name,
            code=payload.code,
            description=payload.description,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(des)
        await publish_admin_event(
            DesignationCreated(
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

    async def update_designation(
        self,
        company_id: uuid.UUID,
        designation_id: uuid.UUID,
        payload: DesignationUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Designation:
        des = await self.repo.get_by_id_with_tenant(company_id, designation_id)
        if not des:
            raise NotFoundException("DESIGNATION_NOT_FOUND", "Designation not found")

        if (
            payload.job_level_id is not None
            and payload.job_level_id != des.job_level_id
        ):
            parent = await self.jl_repo.get_by_id_with_tenant(
                company_id, payload.job_level_id
            )
            if not parent:
                raise NotFoundException(
                    "JOB_LEVEL_NOT_FOUND", "Parent job level not found"
                )
            des.job_level_id = payload.job_level_id

        # Date validations
        ef = payload.effective_from or des.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else des.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or des.code, ef, et, designation_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["job_level_id"]:
                setattr(des, k, v)

        des.updated_by = actor_id
        des.updated_at = datetime.now(UTC).replace(tzinfo=None)

        return await self.repo.create(des)

    async def delete_designation(
        self,
        company_id: uuid.UUID,
        designation_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        des = await self.repo.get_by_id_with_tenant(company_id, designation_id)
        if not des:
            raise NotFoundException("DESIGNATION_NOT_FOUND", "Designation not found")
        des.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        des.is_active = False
        des.updated_by = actor_id
        await self.repo.create(des)
