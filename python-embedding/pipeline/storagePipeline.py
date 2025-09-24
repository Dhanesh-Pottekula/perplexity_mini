from typing import List
from prompts.storagePrompts import StoragePrompts
from agents.llm.ollama import OlamaClient
from models.internalModals import OpenRouterChatModels, StorageAgentPydanticModels
from core.embedding import Embedding


class StoragePipeline:
    def __init__(self):
        self.llm = OlamaClient()
        self.embedding = Embedding()
        self.storagePrompts = StoragePrompts()

    async def process(self, data):
        # Extract topics from content with tags
        response = await self.extractTopicsFromContentWithTags(
            data["content"]
        )

        await self.embedding.upsert_embeddings_topics_qdrant(
            response.topics or [], url_id=data["url_id"]
        )

    async def extractTopicsFromContentWithTags(
        self, content: List[str]
    ) -> StorageAgentPydanticModels.TopicExtractionList:
        prompts = self.storagePrompts.extractTopicsFromContentWithTagsPrompt(content[:10])
        response = await self.llm.generate_structured_output(
            prompts["user_prompt"],
            prompts["system_instruction"],
            StorageAgentPydanticModels.TopicExtractionList,
            model=OpenRouterChatModels.OlamaChatModelTypes.LLAMA3_8B,
        )
        return response


storagePipeline = StoragePipeline()
