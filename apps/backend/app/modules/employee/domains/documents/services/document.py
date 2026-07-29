import uuid

from app.modules.employee.domains.documents.models.document import EmployeeDocument
from app.modules.employee.domains.documents.repositories.document import (
    DocumentRepository,
)


class DocumentService:
    def __init__(self, repository: DocumentRepository):
        self.repository = repository

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> list[EmployeeDocument]:
        return await self.repository.get_by_employee_id(employee_id)
