from typing import List
from prompts.storagePrompts import StoragePrompts
from agents.llm.openRouter import OpenRouter
from models.internalModals import OpenRouterChatModels, StorageAgentPydanticModels
from core.embedding import Embedding
from configs.envConfig import config


class StoragePipeline:
    def __init__(self):
        self.llm = OpenRouter()
        self.embedding = Embedding()
        self.storagePrompts = StoragePrompts()

    async def process(self, data):
        # Extract topics from content with tags
        response = await self.extractTopicsFromContentWithTags(
            data["content"]
        )

        await self.embedding.upsert_embeddings_topics_qdrant(
            response.topics|[], url_id=data["url_id"]
        )

    async def extractTopicsFromContentWithTags(
        self, content: List[str]
    ) -> StorageAgentPydanticModels.TopicExtractionList:
        prompts = self.storagePrompts.extractTopicsFromContentWithTagsPrompt(content)
        response = await self.llm.generate_structured_output(
            prompts["user_prompt"],
            prompts["system_instruction"],
            StorageAgentPydanticModels.TopicExtractionList,
            model=OpenRouterChatModels.OpenRouterChatModelTypes.DEEPSEEK_CHAT_V3_1,
        )
        return response


storagePipeline = StoragePipeline()
