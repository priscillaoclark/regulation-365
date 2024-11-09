// utils/errors.ts
import { ChatError } from "@/types/chat";

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export function handleChatError(error: unknown): ChatError {
  if (error instanceof ChatServiceError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }

  return {
    message: "An unexpected error occurred",
    details: error,
  };
}
