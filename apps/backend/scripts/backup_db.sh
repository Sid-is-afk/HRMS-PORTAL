#!/bin/bash
set -e

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL variable is not set."
  exit 1
fi

BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_${TIMESTAMP}.dump"

echo "Starting database backup..."
pg_dump "$DATABASE_URL" -F c -b -v -f "$BACKUP_FILE"

echo "Backup completed successfully: $BACKUP_FILE"
