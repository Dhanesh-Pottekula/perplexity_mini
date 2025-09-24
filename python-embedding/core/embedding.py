from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, cast
import uuid
from datetime import datetime, timezone
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchAny
from configs.qdrant_config import qdrant_config
from constants import EmbeddingConfig, CollectionNames, PayloadKeys, ErrorMessages
from models.internalModals import StorageAgentPydanticModels


class Embedding:
    def __init__(self):
        self.model = SentenceTransformer(EmbeddingConfig.MODEL_NAME)
        self.vector_size = EmbeddingConfig.VECTOR_SIZE
        self.client = qdrant_config.get_client()

    async def upsert_embeddings_urls(self, url_id: str, texts: List[str]) -> None:
        """Generate embeddings for texts and upsert them to Qdrant collection"""
        # Generate embeddings
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True).tolist()
            # Prepare points for upsert
            points = []
            for i, (text, embedding) in enumerate(zip(texts, embeddings)):
                point_id = str(uuid.uuid4())
                point = PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        PayloadKeys.URL_ID: url_id,
                        PayloadKeys.TEXT: text,
                        PayloadKeys.INDEX: i,
                    },
                )
                points.append(point)

            # Upsert to Qdrant
            self.client.upsert(collection_name=CollectionNames.URLS, points=points)
            

        except Exception as e:
            print(f"{ErrorMessages.UPSERT_ERROR}: {e}")


    async def upsert_embeddings_topics_qdrant(self, texts: List[StorageAgentPydanticModels.TopicExtractionItem], url_id: str = None) -> None:
        """Generate embeddings for texts and upsert them to Qdrant collection with topic merging logic"""
        try:
            # Step 1: Prepare array of unique topic names
            topic_names = list(set([topic.topic_name for topic in texts]))
            
            # Step 2: Get all existing topics that match any of the topic names in a single DB call
            existing_topics: Dict[str, Dict[str, Any]] = {}
            if topic_names:
                # Create filter to get all topics with names in our list
                scroll_filter = Filter(
                    must=[
                        FieldCondition(
                            key=PayloadKeys.TOPIC_NAME,
                            match=MatchAny(any=topic_names),
                        )
                    ]
                )
                
                # Get all matching topics from the database
                existing_topics_records, _ = self.client.scroll(
                    collection_name=CollectionNames.TOPICS,
                    scroll_filter=scroll_filter,
                    limit=len(topic_names),  # Get all matching topics
                    with_payload=True,
                    with_vectors=False,
                )
                
                # Convert to dictionary for easy lookup
                for record in existing_topics_records:
                    payload = cast(Dict[str, Any], record.payload)
                    topic_name = payload[PayloadKeys.TOPIC_NAME]
                    existing_topics[topic_name] = payload
            
            # Step 3: Process each topic decision and create payloads
            tasks = []
            created_at = datetime.now(timezone.utc)
            
            for topic_decision in texts:
                topic_name = topic_decision.topic_name
                tags = topic_decision.tags.copy()  # Make a copy to avoid modifying original
                
                # Check if the topic is already present in the database
                if topic_name in existing_topics:
                    payload = existing_topics[topic_name]
                    topic_id = str(payload[PayloadKeys.TOPIC_ID])
                    # Update the tags by extending with existing tags
                    existing_tags = payload.get(PayloadKeys.TAGS, [])
                    tags.extend(existing_tags)
                    # Remove duplicates while preserving order
                    tags = list(dict.fromkeys(tags))
                    created_at_val = payload[PayloadKeys.CREATED_AT]
                    
                    # Handle URL IDs for existing topics - get existing URL IDs and add new one if not already present
                    existing_url_ids = payload.get(PayloadKeys.URL_IDS, [])
                    if url_id and url_id not in existing_url_ids:
                        existing_url_ids.append(url_id)
                    url_ids = existing_url_ids
                else:
                    # Generate new topic_id if not found in DB
                    topic_id = str(uuid.uuid4())
                    created_at_val = created_at
                    # For new topics, create array with current URL ID
                    url_ids = [url_id] if url_id else []

                # Prepare tags text for embedding
                tags_text = " ".join(tags)
                if not tags_text or not tags_text.strip():
                    tags_text = "general"
                
                # Generate embedding for the tags
                tags_embedding = self.model.encode([tags_text], convert_to_numpy=True).tolist()[0]
                
                # Create the topic payload
                topic_payload = {
                    PayloadKeys.URL_IDS: url_ids,
                    PayloadKeys.TOPIC_ID: topic_id,
                    PayloadKeys.TOPIC_NAME: topic_name,
                    PayloadKeys.TAGS: tags,
                    PayloadKeys.CREATED_AT: created_at_val,
                    PayloadKeys.UPDATED_AT: datetime.now(timezone.utc),
                }
                
                # Create point for upsert
                point = PointStruct(
                    id=topic_id,
                    vector=tags_embedding,
                    payload=topic_payload,
                )
                tasks.append(point)

            # Step 4: Upsert all topics at once
            if tasks:
                self.client.upsert(collection_name=CollectionNames.TOPICS, points=tasks)
                print(f"Successfully upserted {len(tasks)} topics")

        except Exception as e:
            print(f"{ErrorMessages.UPSERT_ERROR}: {e}")

# Global instance
embedding = Embedding()
