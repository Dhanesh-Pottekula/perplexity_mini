import type { Request, Response } from "express";
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

const DEFAULT_END_EVENT = "end";
const DEFAULT_END_DATA = "[DONE]";
const DEFAULT_ERROR_MESSAGE = "Failed to stream response";

type ErrorMessageOption = string | ((error: unknown) => string);

interface StreamSseOptions<TChunk = unknown> {
  endEvent?: string;
  endData?: string;
  errorMessage?: ErrorMessageOption;
  serializer?: (chunk: TChunk) => string;
}

function serializeChunk<T>(chunk: T, serializer?: (chunk: T) => string): string {
  if (serializer) {
    return serializer(chunk);
  }

  if (typeof chunk === "string") {
    return chunk;
  }

  return JSON.stringify(chunk);
}

function formatErrorMessage(errorMessage: ErrorMessageOption | undefined, error: unknown): string {
  if (typeof errorMessage === "function") {
    return errorMessage(error);
  }

  if (typeof errorMessage === "string") {
    return errorMessage;
  }

  return DEFAULT_ERROR_MESSAGE;
}

function toJsonPayload(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return JSON.stringify(value ?? null);
}

export function prepareSse(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
}

export function sendSseError(res: Response, message: unknown): void {
  const payload = toJsonPayload(message);
  res.write(`event: error\ndata: ${payload}\n\n`);
  res.end();
}

export async function streamSse<T>(
  req: Request,
  res: Response,
  streamFactory: () => Promise<AsyncIterable<T>>,
  options: StreamSseOptions<T> = {}
): Promise<void> {
  prepareSse(res);

  let clientGone = false;
  const handleClose = () => {
    clientGone = true;
  };

  req.on("close", handleClose);

  try {
    const stream = await streamFactory();

    for await (const chunk of stream) {
      if (clientGone) {
        break;
      }

      const payload = serializeChunk(chunk, options.serializer);
      res.write(`data: ${payload}\n\n`);
    }

    if (!clientGone) {
      const endEvent = options.endEvent ?? DEFAULT_END_EVENT;
      const endData = options.endData ?? DEFAULT_END_DATA;
      res.write(`event: ${endEvent}\ndata: ${endData}\n\n`);
      res.end();
    }
  } catch (error) {
    if (!clientGone) {
      const message = formatErrorMessage(options.errorMessage, error);
      sendSseError(res, message);
    }
    throw error;
  } finally {
    req.removeListener("close", handleClose);
  }
}

