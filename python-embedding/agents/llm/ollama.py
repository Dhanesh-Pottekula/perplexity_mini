"""Agents - OLAMA Client via Nginx."""

import base64
import json
from typing import AsyncGenerator, TypeVar, Type, Any

import httpx
from pydantic import BaseModel
from json_repair import repair_json  # type: ignore[import]
from models.internalModals import OpenRouterChatModels  # Keep your models
from configs.envConfig import config

GenericType = TypeVar("GenericType", bound=BaseModel)


class OlamaClient:
    """Async-like client for OLAMA via Nginx load balancer."""

    def __init__(self) -> None:
        """Initialize the client."""
        self.model: str = OpenRouterChatModels.OlamaChatModelTypes.LLAMA3_8B
        self.nginx_url_chat: str = config.NGINX_URL+"/api/chat"

    async def generate_text_as_stream(
        self, prompt: str, system_instruction: str, model: str = None
    ) -> AsyncGenerator[str, None]:
        """Generate text via Nginx-forwarded OLAMA with streaming-like chunks."""
        model = model or self.model
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.nginx_url_chat, json=payload)
            response.raise_for_status()
            content: str = response.json()["message"]["content"]

        chunk_size = 100
        for i in range(0, len(content), chunk_size):
            yield content[i : i + chunk_size]

    async def generate_structured_output(
    self,
    prompt: str,
    system_instruction: str,
    response_model: Type[GenericType],
    model: str = None,
) -> GenericType:
        """Generate structured JSON output via Nginx-forwarded OLAMA."""
        model = model or "llama3.1:8b"  # match the curl working model

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.nginx_url_chat, json=payload)
            response.raise_for_status()
            content = response.json()["message"]["content"] or "{}"

        json_str = repair_json(content)
        return response_model.model_validate(json.loads(json_str))
