from fastapi import APIRouter

from app.api.v1.health.router import router as health_router
from app.modules.admin.domains.branches.api.router import router as branch_router
from app.modules.admin.domains.business_units.api.router import (
    router as business_unit_router,
)
from app.modules.admin.domains.cost_centers.api.router import (
    router as cost_center_router,
)
from app.modules.admin.domains.departments.api.router import router as department_router
from app.modules.admin.domains.designations.api.router import (
    router as designation_router,
)
from app.modules.admin.domains.divisions.api.router import router as division_router
from app.modules.admin.domains.job_levels.api.router import router as job_level_router
from app.modules.admin.domains.locations.api.router import router as location_router
from app.modules.admin.domains.organization.api.router import (
    router as organization_router,
)
from app.modules.admin.domains.teams.api.router import router as team_router
from app.modules.auth.api.router import router as auth_router
from app.modules.employee.domains.profile.api.router import router as employee_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, prefix="/health", tags=["Health"])
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_v1_router.include_router(employee_router)
api_v1_router.include_router(organization_router)
api_v1_router.include_router(business_unit_router)
api_v1_router.include_router(division_router)
api_v1_router.include_router(department_router)
api_v1_router.include_router(team_router)
api_v1_router.include_router(designation_router)
api_v1_router.include_router(job_level_router)
api_v1_router.include_router(branch_router)
api_v1_router.include_router(location_router)
api_v1_router.include_router(cost_center_router)
