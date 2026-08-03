import uuid

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions.base import (
    BusinessException,
)
from app.core.middleware.idempotency import idempotency_cache
from app.database.outbox import OutboxEvent
from app.database.outbox_processor import process_outbox_events
from app.modules.platform.domains.tenant.models.tenant import Tenant


@pytest.mark.asyncio
async def test_optimistic_concurrency_locking(db_session: AsyncSession) -> None:
    # 1. Setup Tenant
    tenant = Tenant(
        tenant_code="LOCKCO",
        tenant_name="Lock Corporation",
        status="Active",
        subscription_plan="Standard",
        provisioning_status="Completed",
        version=1,
    )
    db_session.add(tenant)
    await db_session.flush()
    await db_session.commit()

    # 2. Load two separate instances in separate sessions (simulating concurrent reads)
    from tests.conftest import TestingSessionLocal

    async with TestingSessionLocal() as session_a:
        async with TestingSessionLocal() as session_b:
            instance_a = await session_a.get(Tenant, tenant.id)
            instance_b = await session_b.get(Tenant, tenant.id)

            assert instance_a is not None
            assert instance_b is not None

            # Update instance A (this should succeed and increment version to 2)
            instance_a.tenant_name = "Lock Corporation A"
            await session_a.commit()

            # Update instance B (this should fail because version in DB is now 2, but instance B has version 1)
            instance_b.tenant_name = "Lock Corporation B"
            with pytest.raises(Exception) as exc_info:
                await session_b.commit()

            from sqlalchemy.orm.exc import StaleDataError

            assert isinstance(exc_info.value, StaleDataError)


@pytest.mark.asyncio
async def test_transactional_outbox_pattern(db_session: AsyncSession) -> None:
    # 1. Setup Tenant
    tenant = Tenant(
        tenant_code="OUTBOXCO",
        tenant_name="Outbox Corporation",
        status="Active",
        subscription_plan="Premium",
        provisioning_status="Completed",
    )
    db_session.add(tenant)
    await db_session.flush()

    # 2. Trigger platform event under active session context
    from app.database.connection import current_db_session
    from app.events.publishers.platform import publish_platform_event
    from app.modules.platform.domains.events import FeatureEnabled

    token = current_db_session.set(db_session)
    try:
        await publish_platform_event(
            FeatureEnabled(tenant_id=tenant.id, payload={"feature": "MultiFactorAuth"})
        )
    finally:
        current_db_session.reset(token)

    # 3. Before commit, the outbox record is in the session state
    stmt = select(OutboxEvent).where(OutboxEvent.tenant_id == tenant.id)
    res = await db_session.execute(stmt)
    pending_events = list(res.scalars().all())
    assert len(pending_events) == 1
    assert pending_events[0].event_type == "FeatureEnabled"
    assert pending_events[0].status == "Pending"

    # Commit transaction
    await db_session.commit()

    # 4. Background Processor execution
    processed_count = await process_outbox_events(db_session)
    assert processed_count == 1

    # 5. Verify status updated to Processed
    stmt_after = select(OutboxEvent).where(OutboxEvent.tenant_id == tenant.id)
    res_after = await db_session.execute(stmt_after)
    processed_event = res_after.scalars().one()
    assert processed_event.status == "Processed"
    assert processed_event.processed_at is not None


@pytest.mark.asyncio
async def test_idempotency_caching_and_conflict() -> None:
    from fastapi import Request
    from fastapi.responses import JSONResponse

    from app.core.middleware.idempotency import (
        IdempotencyChecker,
        IdempotencyMiddleware,
        IdempotentResponseException,
        _idempotency_mem_cache,
    )

    # 1. Clean memory cache
    _idempotency_mem_cache.clear()

    # 2. Setup mock request
    idem_key = f"key-{uuid.uuid4()}"
    scope = {
        "type": "http",
        "method": "POST",
        "path": "/api/v1/platform/tenants",
        "headers": [(b"idempotency-key", idem_key.encode())],
    }

    from typing import Any
    from fastapi import Response

    async def mock_receive() -> dict[str, Any]:
        return {"type": "http.request", "body": b'{"test": "data"}', "more_body": False}

    req = Request(scope, receive=mock_receive)
    req.state.idempotency_hash = None

    # 3. Call checker
    checker = IdempotencyChecker()
    await checker(req)

    # Ensure req.state.idempotency_hash is populated
    assert req.state.idempotency_hash is not None
    req_hash = req.state.idempotency_hash

    # Cache lookup should be "Processing"
    cached = idempotency_cache.get(req_hash)
    assert cached is not None
    assert cached["status"] == "Processing"

    # Submitting again with "Processing" status should throw 409 Conflict
    from fastapi.exceptions import HTTPException

    with pytest.raises(HTTPException) as exc_info:
        await checker(req)
    assert exc_info.value.status_code == 409

    # 4. Now simulate completed request middleware dispatch
    middleware = IdempotencyMiddleware(app=None)  # type: ignore[arg-type]

    async def call_next(request: Request) -> Response:
        resp = JSONResponse(content={"id": "new-tenant"}, status_code=201)
        request.state.idempotency_hash = req_hash
        return resp

    await middleware.dispatch(req, call_next)

    # Verification: cache status is now Completed
    cached_after = idempotency_cache.get(req_hash)
    assert cached_after is not None
    assert cached_after["status"] == "Completed"
    assert cached_after["response"]["body"] == {"id": "new-tenant"}
    assert cached_after["response"]["status_code"] == 201

    # Now calling checker again should raise IdempotentResponseException
    with pytest.raises(IdempotentResponseException) as exc_resp:
        await checker(req)

    assert exc_resp.value.response.status_code == 201
    assert (
        exc_resp.value.response.headers.get("X-Cache-Lookup")
        == "HIT - Idempotent Request"
    )


@pytest.mark.asyncio
async def test_shared_domain_policies(db_session: AsyncSession) -> None:
    # 1. ActiveTenantPolicy
    from app.modules.platform.domains.tenant.repositories.tenant import TenantRepository
    from app.modules.shared.policies.active_tenant import ActiveTenantPolicy

    tenant_repo = TenantRepository(db_session)
    tenant_policy = ActiveTenantPolicy(tenant_repo)

    # Setup inactive tenant
    tenant = Tenant(
        tenant_code="INACTCO",
        tenant_name="Inactive Company",
        status="Suspended",
        subscription_plan="Free",
        provisioning_status="Completed",
    )
    db_session.add(tenant)
    await db_session.flush()
    await db_session.commit()

    # Expect BusinessException when checking inactive tenant
    with pytest.raises(BusinessException) as exc_info:
        await tenant_policy.check(tenant.id)
    assert exc_info.value.code == "TENANT_INACTIVE"

    # 2. ManagerAssignmentPolicy (Self-Management check)
    from app.modules.employee.domains.profile.repositories.employee import (
        EmployeeRepository,
    )
    from app.modules.shared.policies.manager_assignment import ManagerAssignmentPolicy

    emp_repo = EmployeeRepository(db_session)
    manager_policy = ManagerAssignmentPolicy(emp_repo)

    emp_id = uuid.uuid4()
    with pytest.raises(BusinessException) as exc_info:
        await manager_policy.check(emp_id, emp_id)
    assert exc_info.value.code == "SELF_MANAGEMENT_FORBIDDEN"
