from collections.abc import AsyncGenerator
from contextvars import ContextVar
from typing import Any

from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import ORMExecuteState, Session, with_loader_criteria

from app.core.config.settings import get_settings
from app.modules.platform.domains.context_vars import (
    bypass_tenant_context,
    current_tenant_context,
)

current_db_session: ContextVar[AsyncSession | None] = ContextVar(
    "current_db_session", default=None
)
bypass_outbox_context: ContextVar[bool] = ContextVar(
    "bypass_outbox_context", default=False
)


# Event listeners for automatic tenant isolation
@event.listens_for(Session, "do_orm_execute")
def _do_orm_execute(orm_execute_state: ORMExecuteState) -> None:
    if bypass_tenant_context.get():
        return

    tenant_id = current_tenant_context.get().tenant_id
    if not tenant_id:
        return

    if orm_execute_state.is_select:
        for mapper in orm_execute_state.all_mappers:
            cls = mapper.class_
            if hasattr(cls, "tenant_id"):
                orm_execute_state.statement = orm_execute_state.statement.options(
                    with_loader_criteria(
                        cls,
                        lambda target: target.tenant_id == tenant_id,
                        track_closure_variables=False,
                    )
                )
            elif hasattr(cls, "company_id"):
                orm_execute_state.statement = orm_execute_state.statement.options(
                    with_loader_criteria(
                        cls,
                        lambda target: target.company_id == tenant_id,
                        track_closure_variables=False,
                    )
                )
    elif orm_execute_state.is_update or orm_execute_state.is_delete:
        statement: Any = orm_execute_state.statement
        entity = statement.table
        if "tenant_id" in entity.c:
            orm_execute_state.statement = statement.where(
                entity.c.tenant_id == tenant_id
            )
        elif "company_id" in entity.c:
            orm_execute_state.statement = statement.where(
                entity.c.company_id == tenant_id
            )


def get_engine() -> AsyncEngine:
    settings = get_settings()
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if "?" in db_url:
        base, query = db_url.split("?", 1)
        params = []
        for param in query.split("&"):
            if not any(
                param.startswith(bad) for bad in ("sslmode=", "channel_binding=")
            ):
                params.append(param)
        if params:
            db_url = f"{base}?{'&'.join(params)}"
        else:
            db_url = base

    return create_async_engine(
        db_url,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        echo=settings.DEBUG,
        pool_pre_ping=True,
    )


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    engine = get_engine()
    return async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession]:  # FastAPI dependency
    session_factory = get_session_factory()
    async with session_factory() as session:
        token = current_db_session.set(session)
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            current_db_session.reset(token)
