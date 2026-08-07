import logging
import logging.config
from contextvars import ContextVar

# ContextVar storing the current request correlation ID, defaulting to "-"
correlation_id_var: ContextVar[str] = ContextVar("correlation_id_var", default="-")


class CorrelationIdFilter(logging.Filter):
    """
    Python Logging Filter that automatically injects the request-scoped
    correlation ID ContextVar into the log record attributes.
    """

    def filter(self, record: logging.LogRecord) -> bool:
        record.correlation_id = correlation_id_var.get()
        return True


def setup_logging(log_level: str = "INFO") -> None:
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json": {
                "format": "%(asctime)s %(levelname)s %(message)s %(correlation_id)s",
                "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
            }
        },
        "filters": {
            "correlation_id": {
                "()": CorrelationIdFilter,
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "json",
                "filters": ["correlation_id"],
            }
        },
        "root": {
            "handlers": ["console"],
            "level": log_level,
        },
    }
    logging.config.dictConfig(logging_config)
