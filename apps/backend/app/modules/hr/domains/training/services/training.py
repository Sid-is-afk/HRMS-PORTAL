import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import TrainingCompleted
from app.modules.hr.domains.training.models.training import Training
from app.modules.hr.domains.training.repositories.training import TrainingRepository
from app.modules.hr.domains.training.schemas.training import TrainingCreateRequest


class TrainingService:
    def __init__(self, repo: TrainingRepository):
        self.repo = repo

    async def get_training(
        self, company_id: uuid.UUID, training_id: uuid.UUID
    ) -> Training:
        res = await self.repo.get_by_id_with_tenant(company_id, training_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Training not found")
        return res

    async def create_training(
        self, company_id: uuid.UUID, payload: TrainingCreateRequest
    ) -> Training:
        training = Training(
            company_id=company_id,
            name=payload.name,
            description=payload.description,
            trainer=payload.trainer,
        )
        return await self.repo.create(training)

    async def complete_training(
        self,
        company_id: uuid.UUID,
        training_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> Training:
        training = await self.get_training(company_id, training_id)
        await publish_hr_event(
            TrainingCompleted(
                company_id=company_id,
                actor_id=actor_id,
                payload={"training_id": str(training_id)},
            )
        )
        return training
