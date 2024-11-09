// types/chat.ts
export type ChatType = "document" | "regulation";

export interface ChatLog {
  id?: string;
  user_id?: string;
  chat_type: ChatType;
  document_id?: string;
  prompt: string;
  response: string;
  embedding?: number[];
  tokens_used?: number;
  created_at?: string;
}

export interface ChatError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ChatValidationResult {
  valid: boolean;
  error?: ChatError;
}
