import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.outbox_repository import OutboxRepository
from app.events.publishers.hr import publish_hr_event
from app.events.publishers.platform import publish_platform_event

# HR event imports
from app.modules.hr.domains.events import (
    AttendanceApproved,
    AttendanceSubmitted,
    CandidateInterviewScheduled,
    EmployeeOffboarded,
    EmployeeOnboarded,
    LeaveApproved,
    LeaveRejected,
    LeaveSubmitted,
    OfferAccepted,
    OfferReleased,
    PerformanceCompleted,
    PromotionApproved,
    RecruitmentPublished,
    TrainingCompleted,
    TransferApproved,
)

# Platform event imports
from app.modules.platform.domains.events import (
    AdminIdentityCreated,
    ConfigurationUpdated,
    DefaultRolesSeeded,
    FeatureEnabled,
    LicenseAssigned,
    ModulesEnabled,
    OrganizationCreated,
    ProvisioningCompleted,
    TenantActivated,
    TenantCreated,
    TenantProvisioningStarted,
    TenantSuspended,
    TenantValidated,
)

logger = logging.getLogger("app.database.outbox_processor")

HR_EVENT_MAP = {
    "AttendanceSubmitted": AttendanceSubmitted,
    "AttendanceApproved": AttendanceApproved,
    "LeaveSubmitted": LeaveSubmitted,
    "LeaveApproved": LeaveApproved,
    "LeaveRejected": LeaveRejected,
    "RecruitmentPublished": RecruitmentPublished,
    "CandidateInterviewScheduled": CandidateInterviewScheduled,
    "OfferReleased": OfferReleased,
    "OfferAccepted": OfferAccepted,
    "EmployeeOnboarded": EmployeeOnboarded,
    "EmployeeOffboarded": EmployeeOffboarded,
    "PromotionApproved": PromotionApproved,
    "TransferApproved": TransferApproved,
    "PerformanceCompleted": PerformanceCompleted,
    "TrainingCompleted": TrainingCompleted,
}

PLATFORM_EVENT_MAP = {
    "TenantCreated": TenantCreated,
    "TenantValidated": TenantValidated,
    "TenantProvisioningStarted": TenantProvisioningStarted,
    "OrganizationCreated": OrganizationCreated,
    "DefaultRolesSeeded": DefaultRolesSeeded,
    "AdminIdentityCreated": AdminIdentityCreated,
    "ModulesEnabled": ModulesEnabled,
    "ProvisioningCompleted": ProvisioningCompleted,
    "LicenseAssigned": LicenseAssigned,
    "FeatureEnabled": FeatureEnabled,
    "ConfigurationUpdated": ConfigurationUpdated,
    "TenantSuspended": TenantSuspended,
    "TenantActivated": TenantActivated,
}


from app.database.connection import bypass_outbox_context


import uuid

async def process_outbox_events(db: AsyncSession) -> int:
    token = bypass_outbox_context.set(True)
    try:
        repo = OutboxRepository(db)
        pending = await repo.get_pending_events()
        processed_count = 0

        for event in pending:
            try:
                # Check type map
                if event.event_type in HR_EVENT_MAP:
                    hr_event_cls = HR_EVENT_MAP[event.event_type]
                    # Reconstruct Pydantic event object
                    company_id = (
                        event.tenant_id
                        if event.tenant_id is not None
                        else uuid.UUID(int=0)
                    )
                    hr_event_obj = hr_event_cls(
                        event_id=event.event_id,
                        event_type=event.event_type,
                        company_id=company_id,
                        payload=event.payload,
                        timestamp=event.created_at,
                    )
                    await publish_hr_event(hr_event_obj)
                elif event.event_type in PLATFORM_EVENT_MAP:
                    plat_event_cls = PLATFORM_EVENT_MAP[event.event_type]
                    t_id = (
                        event.tenant_id
                        if event.tenant_id is not None
                        else uuid.UUID(int=0)
                    )
                    plat_event_obj = plat_event_cls(
                        event_id=event.event_id,
                        event_type=event.event_type,
                        tenant_id=t_id,
                        payload=event.payload,
                        timestamp=event.created_at,
                    )
                    await publish_platform_event(plat_event_obj)
                else:
                    logger.warning(f"Unknown outbox event type: {event.event_type}")

                await repo.mark_as_processed(event.event_id)
                processed_count += 1
            except Exception as e:
                logger.error(
                    f"Failed to process outbox event {event.event_id}: {str(e)}"
                )
                await repo.mark_as_failed(event.event_id, str(e))

        # Commit outbox updates
        await db.commit()
        return processed_count
    finally:
        bypass_outbox_context.reset(token)
