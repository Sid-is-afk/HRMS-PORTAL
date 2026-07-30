from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.exceptions.handlers import register_exception_handlers
from app.api.v1.router import api_v1_router
from app.core.config.settings import get_settings
from app.core.logging.config import setup_logging
from app.core.middleware.correlation import CorrelationIdMiddleware
from app.core.middleware.timing import TimingMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    # Startup
    settings = get_settings()
    setup_logging(settings.LOG_LEVEL)
    yield
    # Shutdown


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Middleware (order matters — outermost first)
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(TimingMiddleware)
    app.add_middleware(CorrelationIdMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

    # Exception handlers
    register_exception_handlers(app)

    # Routers
    app.include_router(api_v1_router, prefix="/api/v1")

    return app


app = create_app()

# Trigger reload to load updated CORS settings
