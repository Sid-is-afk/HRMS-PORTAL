# Incident Response Guide - Enterprise HRMS Portal

This guide provides operational procedures for responding to high-severity platform incidents.

---

## 1. Primary Incident Checklist
1. **Declare**: Acknowledge the incident and notify the operations team.
2. **Mitigate**: Re-route public routes to static maintenance pages to prevent user friction.
3. **Analyze**: Query structured logs to isolate correlation/trace IDs and error codes.
4. **Resolve**: Deploy code/configuration rollbacks or database point-in-time recovery.
5. **Close**: Conduct a post-mortem audit to prevent recurrence.

## 2. Database Corruption or Loss
1. Check the availability of the primary Neon PostgreSQL instance.
2. If compute-level connection pooling fails, inspect database connection count statistics.
3. If data is corrupted, use Neon PITR or restore to the latest healthy `.dump` snapshot.

## 3. Redis Cache Failure
1. If Redis goes offline, the application falls back automatically to in-memory caching for idempotency hashes.
2. Verify Redis container logs:
   ```bash
   docker compose -f docker-compose.prod.yml logs redis
   ```
3. Restart the Redis container. Idempotency checks will rebuild fresh locks automatically.
