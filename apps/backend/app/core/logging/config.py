import logging.config


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
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "json",
            }
        },
        "root": {
            "handlers": ["console"],
            "level": log_level,
        },
    }
    logging.config.dictConfig(logging_config)
