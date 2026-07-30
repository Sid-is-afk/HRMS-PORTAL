import uuid
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException, NotFoundException
from app.events.publishers.admin import publish_admin_event
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.locations.models.location import Location
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.locations.schemas.schemas import (
    LocationCreateRequest,
    LocationUpdateRequest,
)
from app.modules.admin.domains.organization.events.events import LocationCreated


class LocationService:
    def __init__(self, repo: LocationRepository, branch_repo: BranchRepository):
        self.repo = repo
        self.branch_repo = branch_repo

    async def _check_overlaps(
        self,
        company_id: uuid.UUID,
        name: str,
        ef: date,
        et: date | None,
        exclude_id: uuid.UUID | None = None,
    ) -> None:
        stmt = select(Location).where(
            Location.company_id == company_id,
            Location.name == name,
            Location.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Location.id != exclude_id)

        res = await self.repo.session.execute(stmt)
        others = res.scalars().all()
        for o in others:
            o_ef = o.effective_from
            o_et = o.effective_to
            if (o_et is None or ef <= o_et) and (et is None or et >= o_ef):
                raise BusinessException(
                    "HIERARCHY_CONFLICT",
                    f"Effective dates overlap with another active location name '{name}'",
                )

    async def create_location(
        self,
        company_id: uuid.UUID,
        payload: LocationCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Location:
        await self._check_overlaps(
            company_id, payload.name, payload.effective_from, payload.effective_to
        )

        parent = await self.branch_repo.get_by_id_with_tenant(
            company_id, payload.branch_id
        )
        if not parent:
            raise NotFoundException("BRANCH_NOT_FOUND", "Parent branch not found")

        loc = Location(
            company_id=company_id,
            branch_id=payload.branch_id,
            name=payload.name,
            location_type=payload.location_type,
            timezone=payload.timezone,
            address=payload.address,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            is_active=payload.is_active,
            created_by=actor_id,
            updated_by=actor_id,
        )
        created = await self.repo.create(loc)
        await publish_admin_event(
            LocationCreated(
                company_id=company_id,
                actor_id=actor_id,
                payload={"id": str(created.id), "name": created.name},
            )
        )
        return created

    async def update_location(
        self,
        company_id: uuid.UUID,
        location_id: uuid.UUID,
        payload: LocationUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Location:
        loc = await self.repo.get_by_id_with_tenant(company_id, location_id)
        if not loc:
            raise NotFoundException("LOCATION_NOT_FOUND", "Location not found")

        if payload.branch_id is not None and payload.branch_id != loc.branch_id:
            parent = await self.branch_repo.get_by_id_with_tenant(
                company_id, payload.branch_id
            )
            if not parent:
                raise NotFoundException("BRANCH_NOT_FOUND", "Parent branch not found")
            loc.branch_id = payload.branch_id

        # Date validations
        ef = payload.effective_from or loc.effective_from
        et = (
            payload.effective_to
            if payload.effective_to is not None
            else loc.effective_to
        )
        if payload.effective_from or payload.effective_to is not None:
            await self._check_overlaps(
                company_id, payload.name or loc.name, ef, et, location_id
            )

        for k, v in payload.model_dump(exclude_unset=True).items():
            if k not in ["branch_id"]:
                setattr(loc, k, v)

        loc.updated_by = actor_id
        loc.updated_at = datetime.now(UTC).replace(tzinfo=None)

        return await self.repo.create(loc)

    async def delete_location(
        self,
        company_id: uuid.UUID,
        location_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        loc = await self.repo.get_by_id_with_tenant(company_id, location_id)
        if not loc:
            raise NotFoundException("LOCATION_NOT_FOUND", "Location not found")
        loc.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        loc.is_active = False
        loc.updated_by = actor_id
        await self.repo.create(loc)
