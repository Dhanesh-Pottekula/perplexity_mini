export class StoragePrompts {
  extractTopicsFromContentWithTagsPrompt(content: string[]): { system_instruction: string; user_prompt: string } {
    const joined = Array.isArray(content) ? content.join(" ") : String(content || "");
    // Remove HTML tags
    let cleaned = joined.replace(/<[^>]+>/g, " ");
    // Normalize whitespace and control chars
    cleaned = cleaned.replace(/[\r\n\t]+/g, " ").replace(/ +/g, " ").trim();
    // Remove non-printable
    cleaned = Array.from(cleaned).filter(c => c >= " " && c <= "~").join("");

    const system_instruction = "Extract generic topics and tags from content. Focus on broad, reusable themes rather than specific details. Return JSON format: {'topics':[{'topic_name': 'generic topic', 'tags': ['tag1', 'tag2']}]} All topics and tags must be lowercase.Extract 3-5 generic topics with 2-5 tags each. Use broad themes like 'artificial intelligence' not 'ChatGPT implementation'. Return JSON only.";

    const escaped = cleaned.replace(/\\/g, "\\\\").replace(/"/g, "").replace(/'/g, "").replace(/\n|\r|\t/g, " ");
    const user_prompt = `Content:${escaped}`;

    return { system_instruction, user_prompt };
  }
}

export const storagePrompts = new StoragePrompts();


