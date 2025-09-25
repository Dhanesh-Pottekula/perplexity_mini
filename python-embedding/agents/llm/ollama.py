"""Agents - OLAMA Client via Nginx."""

import json
import logging
from typing import AsyncGenerator, TypeVar, Type

import httpx
from pydantic import BaseModel
from json_repair import repair_json  # type: ignore[import]
from models.internalModals import OpenRouterChatModels  # Keep your models
from configs.envConfig import config
from core.helpers import retry_with_exponential_backoff
import asyncio
GenericType = TypeVar("GenericType", bound=BaseModel)

# Set up logging
logger = logging.getLogger(__name__)


class OlamaClient:
    """Async-like client for OLAMA via Nginx load balancer."""

    def __init__(self) -> None:
        """Initialize the client."""
        self.model: str = OpenRouterChatModels.OlamaChatModelTypes.LLAMA3_8B
        self.nginx_url_chat: str = config.NGINX_URL+"/api/chat"
        self.llm_semaphore = asyncio.Semaphore(config.MAX_CONCURRENT_LLM_CALLS)

    @retry_with_exponential_backoff(max_retries=3, base_delay=1.0, max_delay=30.0)
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

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"Making request to {self.nginx_url_chat} with model {model}")
            response = await client.post(self.nginx_url_chat, json=payload)
            response.raise_for_status()
            content: str = response.json()["message"]["content"]
            logger.info(f"Successfully received response from {self.nginx_url_chat}")

        chunk_size = 100
        for i in range(0, len(content), chunk_size):
            yield content[i : i + chunk_size]

    @retry_with_exponential_backoff(max_retries=3, base_delay=1.0, max_delay=30.0)
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
                {"role": "user", "content": "Content:Skip to content Home News Sport Business Innovation Culture Arts Travel Earth Audio Video Live Israel-Gaza War War in Ukraine US & Canada UK Africa Asia Australia Europe Latin America Middle East In Pictures BBC InDepth BBC Verify LIVE Typhoon Ragasa makes landfall in China after 17 killed in Taiwan Typhoon Ragasa has now hit southern China after leaving a trail of destruction across the region. Howling winds and sheets of rain: In the eye of a typhoon in China The strong winds hit in waves - typhoon in China The strong winds hit in waves - and standing upright is almost impossible, our correspondent writes. 1 hr ago Asia LIVE Authenticated videos show huge fire at Russian oil refinery Latest updates from the BBCs specialists in fact-checking, verifying video and tackling disinformation. Huntingtons disease successfully treated for first time One of the most devastating diseases finally has a treatment that can slow its progression and transform lives, tearful doctors tell BB ssion and transform lives, tearful doctors tell BBC. 6 mins ago Health Kimmel pulls no punches as he ramps up battle with Trump The US talk show host isnt backing down after being suspended, it seems to have hardened his resolve. 49 mins ago Culture The Gen Z uprising in Asia shows social media is a double-edged sword Anti-corruption demonstrations have toppled a government - will they lead to lasting change? 14 hrs ago BBC InDepth Killed seeking food - Jeremy Bowen on Abdullahs shooting eeking food - Jeremy Bowen on Abdullahs shooting and Gazas lethal aid system Inside Panorama and BBC Eyes investigation into hunger in Gaza and why so many are risking their lives for aid. 14 hrs ago Middle East Born in India, but not Indian: Stateless man fights for citizenship Bahison Ravindran thought he was an Indian by birth - until police declared his passport invalid. 4 hrs ago Asia Bollywood stars fight for personality rights amid deepfake surge Boss jailed for 15 years over dea d deepfake surge Boss jailed for 15 years over deadly fire at S Korea battery plant Australia journalist unfairly fired over Gaza post awarded A$150,000 Six years ago Trumps UN audience laughed, this year they were silent Dua Lipa denies firing agent over pro-Israel views MORE TO EXPLORE Gaza City medics describe hospital overwhelmed by casualties from Israeli strikes Australian doctors say they are having to operate in filthy conditions with few or no anaesthetics. 2 hrs ago World Cups, pant ew or no anaesthetics. 2 hrs ago World Cups, pants or tampons - whats the best period choice for me? Here is a guide to how each product works and the pros and cons to help you decide what might suit you. 12 hrs ago Health Is the Epstein email one scandal too many for Duchess of York? Her links to sex offender Jeffrey Epstein seem much harder to resolve than previous mistakes. 24 hrs ago UK Fact-checking claims Trump made about autism Experts have hit back at claims that use of a common p rts have hit back at claims that use of a common painkiller could cause autism in children. 21 hrs ago BBC Verify H-1B visa changes may give Canada an opportunity. Will it seize it? The US visa shake-up could push talent north — but experts caution that Canada’s immigration system has its own challenges. 14 hrs ago US & Canada Lulu: Telling the world Im an alcoholic was liberating The Shout singer discloses her alcohol problem - and the family history that contributed to it. 12 hrs ago Cul ly history that contributed to it. 12 hrs ago Culture The Gen Z uprising in Asia shows social media is a double-edged sword Anti-corruption demonstrations have toppled a government - will they lead to lasting change? 14 hrs ago BBC InDepth MOST WATCHED 1 Watch: Flood destroys bridge as Super Typhoon Ragasa hits Taiwan 2 Moment sinkhole pulls down power lines in busy Bangkok street 3 Macron calls Trump after motorcade blocks his car 4 I didnt intend to make light of Charlie Kirk murder, say intend to make light of Charlie Kirk murder, says Jimmy Kimmel 5 Watch: BBC correspondent reports from southern China hit by king of storms ALSO IN NEWS Watch: Flood destroys bridge as Super Typhoon Ragasa hits Taiwan At least two people died and dozens are missing after the typhoon lashed Taiwans east coast with heavy wind and rain. 11 hrs ago Asia Macron calls Trump after motorcade blocks his car Macron and Trump were in New York for the 80th UN General Assembly 15 hrs ago World In pi e 80th UN General Assembly 15 hrs ago World In pictures: Indias Kolkata sees worst rains in 39 years At least 10 people have died, most from electrocution, following the record-breaking downpour. 5 hrs ago Asia Influencer mocked for stammer refuses Dortmund apology Jessie Yendle says videos posted by Borussia Dortmund and Ironman used her as clickbait. 6 hrs ago Wales Australia journalist unfairly fired over Gaza post awarded A$150,000 Australias public broadcaster sacrificed AntoiExtract 3-5 generic topics with 2-5 tags each. Use broad themes like 'artificial intelligence' not 'ChatGPT implementation'. Return JSON only."
},
            ],
            "stream": False,
        }
        async with self.llm_semaphore:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    logger.info(f"Making structured output request to {self.nginx_url_chat} with model {model}")
                    response = await client.post(self.nginx_url_chat, json=payload)
                    response.raise_for_status()
                    content = response.json()["message"]["content"] or "{}"
                    logger.info(f"Successfully received structured response from {self.nginx_url_chat}")

                json_str = repair_json(content)
                result = response_model.model_validate(json.loads(json_str))
                logger.info("Successfully parsed and validated structured output")
                return result
            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Failed to parse JSON response: {e}. Content: {content[:200]}...")
                raise
