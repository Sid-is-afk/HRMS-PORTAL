from app.core.exceptions.base import AuthorizationException
from app.modules.platform.domains.context_vars import current_tenant_context


class PermissionValidationPolicy:
    def check(self, required_permission: str) -> None:
        ctx = current_tenant_context.get()
        if not ctx:
            raise AuthorizationException(
                "UNAUTHORIZED", "Missing tenant credentials context"
            )

        # Check permissions list
        user_perms = ctx.permissions or []
        if required_permission not in user_perms:
            raise AuthorizationException(
                "FORBIDDEN", f"Missing required permission: {required_permission}"
            )

        # Ensure role exists in context
        if not ctx.active_role:
            raise AuthorizationException(
                "FORBIDDEN", "No role assigned to current active session"
            )

        # Bypass admin role from permission checking if required
        if ctx.active_role == "Tenant Admin":
            return
