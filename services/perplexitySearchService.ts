import { getPerplexityClient, PerplexityChatResponse } from "../configs/perplexity";

type RawSearchResult = {
  title?: string;
  url?: string;
  snippet?: string;
  text?: string;
};

type SearchResult = {
  title: string;
  url: string;
  snippet?: string;
};

type SearchResponse = SearchResult[];

const SNIPPET_INSTRUCTIONS =
  "Return JSON only. Respond with an array of objects with the keys title, url, and snippet. Omit markdown fences.";

function extractJsonPayload(content: string | undefined): unknown {
  if (!content) {
    return null;
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return null;
  }

  const codeFenceMatch = trimmed.match(/```(?:json)?([\s\S]*?)```/i);
  const jsonCandidate = codeFenceMatch ? codeFenceMatch[1].trim() : trimmed;

  const firstBracketIndex = jsonCandidate.indexOf("[");
  const lastBracketIndex = jsonCandidate.lastIndexOf("]");

  if (firstBracketIndex >= 0 && lastBracketIndex > firstBracketIndex) {
    const possibleJson = jsonCandidate.slice(firstBracketIndex, lastBracketIndex + 1);
    try {
      return JSON.parse(possibleJson);
    } catch (error) {
      console.warn("⚠️ Failed to parse Perplexity JSON payload:", error);
      return null;
    }
  }

  try {
    return JSON.parse(jsonCandidate);
  } catch (error) {
    console.warn("⚠️ Failed to parse Perplexity response:", error);
    return null;
  }
}

function normaliseSearchResults(payload: unknown, maxResults: number): SearchResponse {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter((entry): entry is RawSearchResult => Boolean(entry) && typeof entry === "object")
    .map((entry) => ({
      title: entry.title ?? "",
      url: entry.url ?? "",
      snippet: entry.snippet ?? entry.text,
    }))
    .filter((entry) => Boolean(entry.url))
    .slice(0, maxResults);
}

function buildRequestBody(query: string, client: ReturnType<typeof getPerplexityClient>, maxResults: number) {
  return {
    ...client.defaultBody,
    messages: [
      {
        role: "system" as const,
        content: `${SNIPPET_INSTRUCTIONS} Limit results to ${maxResults}.`,
      },
      {
        role: "user" as const,
        content: `Search query: ${query}`,
      },
    ],
  };
}

export async function runPerplexitySearch(
  queries: string[],
  maxResults: number = 5
): Promise<SearchResponse[]> {
  if (!Array.isArray(queries) || queries.length === 0) {
    return [];
  }

  const perplexityClient = getPerplexityClient();

  if (!perplexityClient.hasValidKey) {
    console.warn("⚠️ Perplexity API key missing; search is disabled.");
    return [];
  }

  const cappedResults = Math.max(1, Math.min(maxResults ?? 5, 25));

  const responses = await Promise.all(
    queries.map(async (query) => {
      try {
        const body = buildRequestBody(query, perplexityClient, cappedResults);
        const response = (await perplexityClient.post(body)) as PerplexityChatResponse;
        const content = response?.choices?.[0]?.message?.content;
        const payload = extractJsonPayload(content);
        return normaliseSearchResults(payload, cappedResults);
      } catch (error) {
        console.error(`❌ Perplexity search failed for query "${query}":`, error);
        return [];
      }
    })
  );

  return responses;
}
