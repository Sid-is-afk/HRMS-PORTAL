import uuid

from app.modules.hr.domains.holiday.models.holiday import Holiday
from app.modules.hr.domains.holiday.repositories.holiday import HolidayRepository
from app.modules.hr.domains.holiday.schemas.holiday import HolidayCreateRequest


class HolidayService:
    def __init__(self, repo: HolidayRepository):
        self.repo = repo

    async def create_holiday(
        self, company_id: uuid.UUID, payload: HolidayCreateRequest
    ) -> Holiday:
        holiday = Holiday(
            company_id=company_id,
            name=payload.name,
            holiday_date=payload.holiday_date,
            holiday_type=payload.holiday_type,
        )
        return await self.repo.create(holiday)
