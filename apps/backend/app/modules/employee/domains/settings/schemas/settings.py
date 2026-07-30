from pydantic import BaseModel


class Preferences(BaseModel):
    theme: str = "system"
    language: str = "en"


class NotificationPreferences(BaseModel):
    push: bool = True
    email: bool = True
    sms: bool = False


class PrivacySettings(BaseModel):
    profileVisibility: str = "employees"
    showOnlineStatus: bool = True


class SecuritySettings(BaseModel):
    twoFactorEnabled: bool = False
    biometricsEnabled: bool = False


class UserSettingsResponse(BaseModel):
    preferences: Preferences
    notificationPreferences: NotificationPreferences
    privacySettings: PrivacySettings
    securitySettings: SecuritySettings
