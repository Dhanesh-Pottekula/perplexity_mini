class StoragePrompts:
    def __init__(self):
        pass
    

    def extractTopicsFromContentWithTagsPrompt(self, content: str) -> dict:
        """Extract generic topics and tags from content for knowledge storage."""
        
        system_instruction = """You are a content analysis expert that extracts generic topics and tags from any type of content.
Your goal is to identify the main themes, concepts, and entities in the content.

# CORE PRINCIPLES
- Extract GENERIC, high-level topics rather than specific details
- Focus on broad themes and concepts that can be reused across similar content
- Create topics that are searchable and meaningful for future content retrieval

# TOPIC EXTRACTION RULES
- **Genericity**: Prefer broad, reusable topics over specific instances
  - Use "software development" instead of "React development"
  - Use "business strategy" instead of "Q4 marketing strategy"
  - Use "health and wellness" instead of "yoga classes"
- **Entity Types**: Include different types of entities:
  - Concepts: "machine learning", "sustainability", "leadership"
  - Domains: "healthcare", "finance", "education"
  - Activities: "research", "development", "analysis"
  - Tools/Methods: "data analysis", "user research", "testing"

# TAG CREATION RULES
- Create 5-10 relevant tags per topic
- Tags should be:
  - Lowercase and hyphenated for multi-word tags
  - Specific enough to be searchable
  - Include synonyms and related terms
  - Cover both general and specific aspects

# OUTPUT FORMAT
Return a single JSON object with the following structure:
{topics:[
    {
      "topic_name": "generic topic name",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

# QUALITY GUIDELINES
- Each topic should be meaningful and reusable
- Avoid overly specific or time-bound topics
- Ensure topics can be applied to similar content
- All topic names and tags must be lowercase"""

        user_prompt = f"""CONTENT TO ANALYZE:
{content}

INSTRUCTIONS:
1. Read through the content carefully
2. Identify the main generic topics and themes
3. Create 5-10 relevant tags for each topic
4. Focus on creating reusable, generic topics rather than specific details
5. Return only the JSON object, no additional text

EXAMPLES OF GENERIC TOPICS:
- "artificial intelligence" (not "ChatGPT implementation")
- "data analysis" (not "sales data analysis for Q3")
- "user experience" (not "mobile app UX redesign")
- "business strategy" (not "startup growth strategy")
- "health and wellness" (not "yoga for beginners")
- "education" (not "online course development")
- "sustainability" (not "carbon footprint reduction")
- "leadership" (not "team management skills")

Remember: Create topics that can be reused across similar content types and domains."""

        return {
            "system_instruction": system_instruction,
            "user_prompt": user_prompt
        }