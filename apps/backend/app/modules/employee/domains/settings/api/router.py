from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.settings.schemas.settings import (
    NotificationPreferences,
    Preferences,
    UserSettingsResponse,
)
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULT_SETTINGS: dict[str, dict[str, Any]] = {
    "preferences": {"theme": "system", "language": "en"},
    "notificationPreferences": {"push": True, "email": True, "sms": False},
    "privacySettings": {"profileVisibility": "employees", "showOnlineStatus": True},
    "securitySettings": {"twoFactorEnabled": False, "biometricsEnabled": False},
}


def get_user_settings(user: User) -> dict[str, Any]:
    profile_info = user.profile_info or {}
    if "settings" not in profile_info:
        return DEFAULT_SETTINGS
    # Merge default settings keys to ensure new fields are populated
    current_settings = profile_info.get("settings", {})
    if not isinstance(current_settings, dict):
        current_settings = {}
    merged = {}
    for key, val in DEFAULT_SETTINGS.items():
        user_val = current_settings.get(key)
        user_dict: dict[str, Any] = user_val if isinstance(user_val, dict) else {}
        merged[key] = {**val, **user_dict}
    return merged


@router.get("", response_model=SuccessResponse[UserSettingsResponse])
async def get_settings(
    current_user: User = Depends(get_current_user),
) -> Any:
    settings = get_user_settings(current_user)
    return SuccessResponse(data=UserSettingsResponse(**settings))


@router.put("", response_model=SuccessResponse[UserSettingsResponse])
async def update_settings(
    payload: UserSettingsResponse,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    profile_info = current_user.profile_info or {}
    profile_info["settings"] = payload.model_dump()
    current_user.profile_info = profile_info
    db.add(current_user)
    await db.commit()
    return SuccessResponse(data=payload)


@router.get("/preferences", response_model=SuccessResponse[Preferences])
async def get_preferences(
    current_user: User = Depends(get_current_user),
) -> Any:
    settings = get_user_settings(current_user)
    return SuccessResponse(data=Preferences(**settings["preferences"]))


@router.put("/preferences", response_model=SuccessResponse[Preferences])
async def update_preferences(
    payload: Preferences,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    profile_info = current_user.profile_info or {}
    settings = profile_info.get("settings", DEFAULT_SETTINGS)
    settings["preferences"] = payload.model_dump()
    profile_info["settings"] = settings
    current_user.profile_info = profile_info
    db.add(current_user)
    await db.commit()
    return SuccessResponse(data=payload)


@router.get("/notifications", response_model=SuccessResponse[NotificationPreferences])
async def get_notifications(
    current_user: User = Depends(get_current_user),
) -> Any:
    settings = get_user_settings(current_user)
    return SuccessResponse(
        data=NotificationPreferences(**settings["notificationPreferences"])
    )


@router.put("/notifications", response_model=SuccessResponse[NotificationPreferences])
async def update_notifications(
    payload: NotificationPreferences,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    profile_info = current_user.profile_info or {}
    settings = profile_info.get("settings", DEFAULT_SETTINGS)
    settings["notificationPreferences"] = payload.model_dump()
    profile_info["settings"] = settings
    current_user.profile_info = profile_info
    db.add(current_user)
    await db.commit()
    return SuccessResponse(data=payload)
