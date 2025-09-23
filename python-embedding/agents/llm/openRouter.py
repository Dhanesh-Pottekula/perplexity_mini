"""Agents - OpenRouter Client."""

import base64
import json
from typing import AsyncGenerator, TypeVar, Type, Any, cast

from pydantic import BaseModel
from openai import OpenAI
from config.envConfig import config
from json_repair import repair_json  # type: ignore[import]

GenericType = TypeVar("GenericType", bound=BaseModel)


class OpenRouter:
    """Provide a minimal async client for interacting with OpenRouter.

    Notes:
        - Uses OpenAI-compatible SDK with OpenRouter base URL.
        - Only implements methods required by the orchestrator.
    """

    def __init__(self) -> None:
        """Initialize the OpenRouter client."""
        # OpenRouter is OpenAI-compatible; set base_url and API key
        api_key: str = str(config.OPENROUTER_API_KEY or "")
        self.client = OpenAI(api_key=api_key, base_url=config.OPENROUTER_BASE_URL)
        self.model: str = "google/gemini-2.5-flash"

    async def generate_text_as_stream(
        self, prompt: str, system_instruction: str, enable_web_search: bool = False
    ) -> AsyncGenerator[str, None]:
        """Generate text for a prompt with real streaming (delta chunks)."""
        model = self.model
        # if enable_web_search:
        #     model = self.model + ":online"
        stream = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt},
            ],
            stream=True,
        )

        for chunk in stream:
            choice = chunk.choices[0]
            if choice.delta and choice.delta.content:
                yield choice.delta.content

    async def generate_structured_output(
        self,
        prompt: str,
        system_instruction: str,
        response_model: Type[GenericType],
        files: list[bytes] | None = None,
    ) -> GenericType:
        """Generate JSON output and parse into the given Pydantic model."""
        user_content = (
            "Extract the following information and respond ONLY in valid JSON.\n"
            + prompt
        )
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content},
            ],
        )
        content = response.choices[0].message.content or "{}"
        json_str = repair_json(content)
        return response_model(**json.loads(json_str))

    async def generate_text_with_files_as_stream(
        self, prompt: str, files: list[tuple[str, bytes]]
    ) -> AsyncGenerator[str, None]:
        """Generate text from a prompt with files as a stream via OpenRouter."""
        content_parts: list[dict[str, Any]] = [{"type": "text", "text": prompt}]

        for _, (mime_type, data) in enumerate(files):
            b64 = base64.b64encode(data).decode("utf-8")
            if mime_type.startswith("image/"):
                content_parts.append(
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{b64}"},
                    }
                )
            else:
                content_parts.append(
                    {
                        "type": "file",
                        "file": {
                            "filename": "uploaded",
                            "file_data": f"data:{mime_type};base64,{b64}",
                        },
                    }
                )

        create_kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": cast(
                Any,
                [
                    {
                        "role": "user",
                        "content": content_parts,
                    }
                ],
            ),
            "stream": True,
        }
        try:
            has_file_part = any(part.get("type") == "file" for part in content_parts)
        except Exception:
            has_file_part = False
        if has_file_part:
            create_kwargs["extra_body"] = {"plugins": [{"id": "file-parser"}]}

        stream: Any = cast(Any, self.client.chat.completions).create(**create_kwargs)

        for chunk in stream:  # type: ignore[assignment]
            choice: Any = chunk.choices[0]
            delta: Any = getattr(choice, "delta", None)
            if delta is not None and getattr(delta, "content", None):
                yield delta.content  # type: ignore[return-value]
