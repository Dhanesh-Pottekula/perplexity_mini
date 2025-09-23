from pydantic import BaseModel
from typing import List

class StorageAgentPydanticModels:
    class TopicExtractionList(BaseModel):
        topic_name: str
        tags: List[str]