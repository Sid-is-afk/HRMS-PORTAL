import hashlib
import json
import logging
import time
from typing import Any

import redis
from fastapi import HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.core.config.settings import get_settings

logger = logging.getLogger("app.core.idempotency")

# In-memory fallback dictionary
_idempotency_mem_cache: dict[str, dict[str, Any]] = {}


class IdempotentResponseException(Exception):
    def __init__(self, response: Response):
        self.response = response


class IdempotencyCache:
    def __init__(self) -> None:
        settings = get_settings()
        try:
            self.redis_client: redis.Redis | None = redis.from_url(
                settings.REDIS_URL, decode_responses=True
            )
            # Test connection
            if self.redis_client:
                self.redis_client.ping()
        except Exception as e:
            logger.warning(
                f"Redis connection failed, falling back to in-memory idempotency cache: {str(e)}"
            )
            self.redis_client = None

    def get(self, key: str) -> dict[str, Any] | None:
        if self.redis_client:
            try:
                val = self.redis_client.get(key)
                if val:
                    return dict(json.loads(str(val)))
            except Exception as e:
                logger.error(f"Redis get failed: {str(e)}")

        # Fallback to in-memory
        record = _idempotency_mem_cache.get(key)
        if record:
            if record["expires_at"] > time.time():
                return record
            else:
                _idempotency_mem_cache.pop(key, None)
        return None

    def set(self, key: str, value: dict[str, Any], expire_seconds: int = 86400) -> None:
        if self.redis_client:
            try:
                self.redis_client.setex(key, expire_seconds, json.dumps(value))
                return
            except Exception as e:
                logger.error(f"Redis setex failed: {str(e)}")

        # Fallback to in-memory
        value["expires_at"] = time.time() + expire_seconds
        _idempotency_mem_cache[key] = value


idempotency_cache = IdempotencyCache()


class IdempotencyChecker:
    async def __call__(self, request: Request) -> None:
        # Check if the header is present
        idempotency_key = request.headers.get("Idempotency-Key")
        if not idempotency_key:
            return

        # Compute hash of key + path + body
        body = await request.body()
        hasher = hashlib.sha256()
        hasher.update(idempotency_key.encode("utf-8"))
        hasher.update(request.url.path.encode("utf-8"))
        hasher.update(request.method.encode("utf-8"))
        hasher.update(body)
        req_hash = hasher.hexdigest()

        # Check cache
        cached = idempotency_cache.get(req_hash)
        if cached:
            if cached["status"] == "Processing":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A request with this Idempotency-Key is already being processed",
                )
            elif cached["status"] == "Completed":
                res_data = cached["response"]
                resp = JSONResponse(
                    content=res_data["body"],
                    status_code=res_data["status_code"],
                    headers=res_data.get("headers"),
                )
                resp.headers["X-Cache-Lookup"] = "HIT - Idempotent Request"
                raise IdempotentResponseException(resp)

        # Set status to Processing
        idempotency_cache.set(req_hash, {"status": "Processing"}, expire_seconds=300)
        request.state.idempotency_hash = req_hash


class IdempotencyMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            response = await call_next(request)
        except IdempotentResponseException as exc:
            return exc.response

        # Check if idempotency hash is set on request state
        req_hash = getattr(request.state, "idempotency_hash", None)
        if req_hash:
            if response.status_code >= 400 and response.status_code != 409:
                # Do not cache bad client requests, delete the processing entry
                if idempotency_cache.redis_client:
                    try:
                        idempotency_cache.redis_client.delete(req_hash)
                    except Exception:
                        pass
                _idempotency_mem_cache.pop(req_hash, None)
            else:
                # Capture body for caching (handling streaming/JSON responses)
                body_content = b""
                if (
                    hasattr(response, "body_iterator")
                    and response.body_iterator is not None
                ):
                    async for chunk in response.body_iterator:
                        body_content += chunk
                else:
                    body_content = getattr(response, "body", b"")

                try:
                    body_json = json.loads(body_content.decode("utf-8"))
                except Exception:
                    body_json = body_content.decode("utf-8")

                # Cache completed response
                cached_resp = {
                    "status_code": response.status_code,
                    "body": body_json,
                    "headers": {
                        k: v
                        for k, v in response.headers.items()
                        if k.lower() not in ("content-length", "date")
                    },
                }
                idempotency_cache.set(
                    req_hash,
                    {"status": "Completed", "response": cached_resp},
                    expire_seconds=86400,  # 24 hours
                )

                # Reconstruct the response since we consumed its body iterator
                return JSONResponse(
                    content=body_json,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                )

        return response
