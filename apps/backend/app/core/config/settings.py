import functools
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "HRMS Backend"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    SECRET_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    REDIS_URL: str
    CORS_ORIGINS: list[str] = ["*"]

    LOG_LEVEL: str = "INFO"

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.APP_ENV == "production":
            if self.DEBUG:
                raise ValueError("DEBUG must be False in production environment")
            if "change-me" in self.SECRET_KEY.lower() or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "SECRET_KEY must be a strong secret of at least 32 characters in production"
                )
            if (
                "change-me" in self.JWT_SECRET_KEY.lower()
                or len(self.JWT_SECRET_KEY) < 32
            ):
                raise ValueError(
                    "JWT_SECRET_KEY must be a strong secret of at least 32 characters in production"
                )
        return self

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )


@functools.lru_cache
def get_settings() -> Settings:
    return Settings()
