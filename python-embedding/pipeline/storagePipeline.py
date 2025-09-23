from typing import List
from prompts import storagePrompts
from models.request_models import StorageResponse
from agents.llm.openRouter import OpenRouter
from models.internalModals import StorageAgentPydanticModels
from core.embedding import Embedding


class StoragePipeline:
    def __init__(self):
        self.llm = OpenRouter()
        self.embedding = Embedding()

    async def process(self, data):
        # Extract topics from content with tags
        response = await self.extractTopicsFromContentWithTags(data["url_id"], data["content"])

        # Upsert topics to Qdrant
        await self.upsertTopicsToQdrant(data["url_id"], response)

        

    async def extractTopicsFromContentWithTags(self, url_id: str, content: List[str]) -> List[str]:
        prompts = storagePrompts.extractTopicsFromContentWithTagsPrompt(content)
        response = await self.llm.generate_structured_output(prompts["user_prompt"], prompts["system_instruction"], StorageResponse)
        return response

    async def upsertTopicsToQdrant(self, url_id: str, topics: List[StorageAgentPydanticModels.TopicExtractionList]) -> None:
        await self.embedding.upsert_embeddings_topics_qdrant(url_id, topics)


storagePipeline = StoragePipeline()