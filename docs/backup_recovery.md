# Backup and Recovery Guide - Enterprise HRMS Portal

This document outlines standard backup frequencies, snapshot parameters, and restore processes.

---

## 1. Backup Strategy
- **Neon PostgreSQL**: Automatically scheduled daily backups and PITR (point-in-time recovery) managed at the Neon database layer.
- **Manual Backups**: Executed prior to running database migrations or release updates.
- **Redis State**: Temporary tokens and idempotency checks. In case of Redis node loss, clear cache prefix references.

## 2. Executing Manual Database Backups
A custom shell script is provided to back up the database:
```bash
./scripts/backup_db.sh
```
This saves a customized binary pg_dump dump inside the `backups/` directory:
- Path: `./backups/db_backup_YYYYMMDD_HHMMSS.dump`

## 3. Restoring Database from Backup
To restore a specific database dump file:
```bash
./scripts/restore_db.sh ./backups/db_backup_20260807_120000.dump
```

> [!WARNING]
> Database restoration is a destructive action that clears all existing data. Always confirm that connection credentials are correct and take a manual snapshot of the current state before restoring.
