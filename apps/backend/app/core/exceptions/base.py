from typing import Any


class AppException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 500,
        details: list[Any] | None = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or []


class ValidationException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 422, details)


class AuthenticationException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 401, details)


class AuthorizationException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 403, details)


class NotFoundException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 404, details)


class BusinessException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 400, details)


class DatabaseException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 500, details)


class InfrastructureException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 500, details)


class ConcurrencyException(AppException):
    def __init__(self, code: str, message: str, details: list[Any] | None = None):
        super().__init__(code, message, 409, details)
