import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.branches.models.branch import Branch
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.branches.schemas.schemas import (
    BranchCreateRequest,
    BranchUpdateRequest,
)
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.organization.events.events import BranchCreated
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)


class BranchService:
    def __init__(
        self,
        repo: BranchRepository,
        org_repo: OrganizationRepository,
        loc_repo: LocationRepository,
    ):
        self.repo = repo
        self.org_repo = org_repo
        self.loc_repo = loc_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        code: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Branch).where(
            Branch.company_id == company_id,
            Branch.code == code,
            Branch.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Branch.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active branch code '{code}'",
                )

    async def create_branch(
        self,
        company_id: uuid.UUID,
        payload: BranchCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Branch:
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

        b = Branch(
            company_id=company_id,
            organization_id=payload.organization_id,
            name=payload.name,
            code=payload.code,
            address=payload.address,
            city=payload.city,
            state=payload.state,
            country=payload.country,
            postal_code=payload.postal_code,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(b)
        await publish_admin_event(
            BranchCreated(
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

    async def update_branch(
        self,
        company_id: uuid.UUID,
        branch_id: uuid.UUID,
        payload: BranchUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Branch:
        b = await self.repo.get_by_id_with_tenant(company_id, branch_id)
        if not b:
            raise NotFoundException("BRANCH_NOT_FOUND", "Branch not found")

        if (
            payload.organization_id is not None
            and payload.organization_id != b.organization_id
        ):
            parent = await self.org_repo.get_by_id_with_tenant(
                company_id, payload.organization_id
            )
            if not parent:
                raise NotFoundException(
                    "ORGANIZATION_NOT_FOUND", "Parent organization not found"
                )
            b.organization_id = payload.organization_id

        # Date validations
        ef = payload.effective_from or b.effective_from
        et = (
            payload.effective_to if payload.effective_to is not None else b.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.code or b.code, ef, et, branch_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["organization_id"]:
                setattr(b, k, v)

        b.updated_by = actor_id
        b.updated_at = datetime.now(UTC).replace(tzinfo=None)

        updated = await self.repo.create(b)

        if payload.is_active is False:
            await self._cascade_deactivate(branch_id)

        return updated

    async def _cascade_deactivate(self, branch_id: uuid.UUID) -> None:
        loc_stmt = select(self.loc_repo.model).where(
            self.loc_repo.model.branch_id == branch_id,
            self.loc_repo.model.deleted_at.is_(None),
        )
        locs = (await self.repo.session.execute(loc_stmt)).scalars().all()
        for loc in locs:
            loc.is_active = False
            await self.loc_repo.create(loc)

    async def delete_branch(
        self,
        company_id: uuid.UUID,
        branch_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        b = await self.repo.get_by_id_with_tenant(company_id, branch_id)
        if not b:
            raise NotFoundException("BRANCH_NOT_FOUND", "Branch not found")
        b.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        b.is_active = False
        b.updated_by = actor_id
        await self.repo.create(b)
