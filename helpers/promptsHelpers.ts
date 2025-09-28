export async function generateStreamChatPrompt(query: string, content: string) {

    const nowIso = new Date().toISOString();

    const systemInstruction = `
    You are a focused research assistant. Use ONLY the provided Context to answer the Query.
    Always prioritize the most recent information in the Context. When dates or timestamps are present, use the newest as authoritative.
    If the Context is insufficient, say you don't know; do not guess. Be concise and factual. Today's date is ${nowIso}.
    `;

    const prompt = `
    Context (may include multiple snippets; prefer the latest):
    ${content}

    Query:
    ${query}

    Guidelines:
    - Prefer the newest dated information when content conflicts.
    - If you cite a time-sensitive fact, include the date from the Context if available.
    - If the Context lacks the answer, explain briefly what's missing and stop.
    - Answer directly and concisely.
    `;

    return {prompt,systemInstruction};
}