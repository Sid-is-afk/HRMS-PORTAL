import asyncio
import os
import sys
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import your models here to ensure they are registered with Base.metadata
try:
    from app.database.base import Base
    # Import all models to ensure registration on metadata
    from app.modules.auth.domains.identity.models.identity import Identity
    from app.modules.auth.domains.users.models.user import User
    from app.modules.auth.domains.roles.models.role import Role
    from app.modules.auth.domains.permissions.models.permission import Permission
    from app.modules.auth.domains.sessions.models.session import Session
    from app.modules.auth.domains.tokens.models.refresh_token import RefreshToken
    # Import Employee domain models
    from app.modules.employee.domains.profile.models.employee import Employee
    from app.modules.employee.domains.contacts.models.contact import ContactInformation
    from app.modules.employee.domains.employment.models.employment import Employment
    from app.modules.employee.domains.emergency.models.emergency import EmergencyContact
    from app.modules.employee.domains.bank.models.bank import BankInformation
    from app.modules.employee.domains.documents.models.document import EmployeeDocument
    # Import Admin domain models
    from app.modules.admin.domains.organization.models.organization import Organization
    from app.modules.admin.domains.business_units.models.business_unit import BusinessUnit
    from app.modules.admin.domains.divisions.models.division import Division
    from app.modules.admin.domains.departments.models.department import Department
    from app.modules.admin.domains.teams.models.team import Team
    from app.modules.admin.domains.designations.models.designation import Designation
    from app.modules.admin.domains.job_levels.models.job_level import JobLevel
    from app.modules.admin.domains.branches.models.branch import Branch
    from app.modules.admin.domains.locations.models.location import Location
    from app.modules.admin.domains.cost_centers.models.cost_center import CostCenter
    target_metadata = Base.metadata
except ImportError:
    target_metadata = None

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def get_url():
    return os.getenv("DATABASE_URL", config.get_main_option("sqlalchemy.url"))

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()
    connectable = create_async_engine(configuration["sqlalchemy.url"])

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
