
import re
class StoragePrompts:
    def __init__(self):
        pass
    def extractTopicsFromContentWithTagsPrompt(self, content) -> dict:
        """Extract generic topics and tags from content for knowledge storage."""
        
        # If content is a list, join into a single string
        if isinstance(content, list):
            content = " ".join(str(c) for c in content)

        # Step 1: Remove HTML tags or fragments
        content = re.sub(r'<[^>]+>', ' ', content)

        # Step 2: Remove multiple newlines, tabs, and extra spaces
        content = re.sub(r'[\r\n\t]+', ' ', content)
        content = re.sub(r' +', ' ', content)

        # Step 3: Remove non-printable/control characters
        content = ''.join(c for c in content if c.isprintable())

        # Step 4: Trim leading/trailing whitespace
        content = content.strip()

        # Step 5: Truncate if too long (adjust length as needed)
        max_length = 1000
        if len(content) > max_length:
            content = content[:max_length]

        # System instruction for the API
        system_instruction = (
            "Extract generic topics and tags from content. Focus on broad, reusable themes "
            "rather than specific details. Return JSON format: "
            '{"topics":[{"topic_name": "generic topic", "tags": ["tag1", "tag2"]}]} '
            "All topics and tags must be lowercase."
        )

        # User prompt with cleaned content
        user_prompt_text = (
            f"Content:\n{content}\n\n"
            "Extract 3-5 generic topics with 2-5 tags each. "
            "Use broad themes like 'artificial intelligence' not 'ChatGPT implementation'. "
            "Return JSON only."
        )

        return {
            "system_instruction": system_instruction,
            "user_prompt": user_prompt_text
        }
