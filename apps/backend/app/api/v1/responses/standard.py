from typing import Any

from pydantic import BaseModel


class SuccessResponse[DataT](BaseModel):
    success: bool = True
    data: DataT
    meta: dict[str, Any] | None = None


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: list[dict[str, Any]] = []


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
    trace_id: str | None = None


class PaginationMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int
