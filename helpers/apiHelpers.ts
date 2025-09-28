import { apiService } from "./fetchHelpers";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function callApi<TResponse, TPayload = unknown>(
  url: string,
  method: HttpMethod,
  payload?: TPayload,
  headers: HeadersInit = {}
): Promise<TResponse> {
  const options: RequestInit = {
    method,
    headers,
  };

  if (payload !== undefined && method !== "GET") {
    options.body = JSON.stringify(payload);
  }

  return apiService.fetch<TResponse>(url, options);
}

