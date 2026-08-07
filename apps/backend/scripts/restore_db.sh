#!/bin/bash
set -e

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <path_to_backup_file.dump>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file does not exist: $BACKUP_FILE"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL variable is not set."
  exit 1
fi

echo "Warning: This will overwrite and restore the database to the state in $BACKUP_FILE."
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Starting database restoration..."
  pg_restore --clean --no-acl --no-owner -d "$DATABASE_URL" -v "$BACKUP_FILE"
  echo "Database restoration completed successfully."
else
  echo "Restoration cancelled."
fi
