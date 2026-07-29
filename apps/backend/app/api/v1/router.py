from fastapi import APIRouter

from app.api.v1.health.router import router as health_router
from app.modules.auth.api.router import router as auth_router
from app.modules.employee.domains.profile.api.router import router as employee_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, prefix="/health", tags=["Health"])
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_v1_router.include_router(employee_router)
