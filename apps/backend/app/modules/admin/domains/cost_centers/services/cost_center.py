import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.cost_centers.models.cost_center import CostCenter
from app.modules.admin.domains.cost_centers.repositories.cost_center import (
    CostCenterRepository,
)
from app.modules.admin.domains.cost_centers.schemas.schemas import (
    CostCenterCreateRequest,
    CostCenterUpdateRequest,
)
from app.modules.admin.domains.organization.events.events import CostCenterCreated
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)


class CostCenterService:
    def __init__(self, repo: CostCenterRepository, org_repo: OrganizationRepository):
        self.repo = repo
        self.org_repo = org_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(CostCenter).where(
            CostCenter.company_id == company_id,
            CostCenter.code == code,
            CostCenter.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(CostCenter.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active cost center code '{code}'",
                )

    async def create_cost_center(
        self,
        company_id: uuid.UUID,
        payload: CostCenterCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> CostCenter:
        await self._check_overlaps(
            company_id, payload.code, payload.effective_from, payload.effective_to
        )

        parent = await self.org_repo.get_by_id_with_tenant(
            company_id, payload.organization_id
        )
        if not parent:
            raise NotFoundException(
                "ORGANIZATION_NOT_FOUND", "Parent organization not found"
            )

        cc = CostCenter(
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
        created = await self.repo.create(cc)
        await publish_admin_event(
            CostCenterCreated(
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

    async def update_cost_center(
        self,
        company_id: uuid.UUID,
        cost_center_id: uuid.UUID,
        payload: CostCenterUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> CostCenter:
        cc = await self.repo.get_by_id_with_tenant(company_id, cost_center_id)
        if not cc:
            raise NotFoundException("COST_CENTER_NOT_FOUND", "Cost center not found")

        if (
            payload.organization_id is not None
            and payload.organization_id != cc.organization_id
        ):
            parent = await self.org_repo.get_by_id_with_tenant(
                company_id, payload.organization_id
            )
            if not parent:
                raise NotFoundException(
                    "ORGANIZATION_NOT_FOUND", "Parent organization not found"
                )
            cc.organization_id = payload.organization_id

        # Date validations
        ef = payload.effective_from or cc.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else cc.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or cc.code, ef, et, cost_center_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["organization_id"]:
                setattr(cc, k, v)

        cc.updated_by = actor_id
        cc.updated_at = datetime.now(UTC).replace(tzinfo=None)

        return await self.repo.create(cc)

    async def delete_cost_center(
        self,
        company_id: uuid.UUID,
        cost_center_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        cc = await self.repo.get_by_id_with_tenant(company_id, cost_center_id)
        if not cc:
            raise NotFoundException("COST_CENTER_NOT_FOUND", "Cost center not found")
        cc.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        cc.is_active = False
        cc.updated_by = actor_id
        await self.repo.create(cc)
