// utils/chat.ts
import { createClient } from "@/utils/supabase/server";
import { ChatLog, ChatError, ChatValidationResult } from "@/types/chat";

export async function logChat(
  chatLog: Omit<ChatLog, "id" | "created_at">
): Promise<{ error: ChatError | null }> {
  const supabase = createClient();

  try {
    console.log("Starting chat log insertion with:", {
      chatType: chatLog.chat_type,
      embeddingLength: chatLog.embedding?.length,
      hasUserId: !!chatLog.user_id,
      hasDocumentId: !!chatLog.document_id,
    });

    const { data, error } = await supabase
      .from("chat_logs")
      .insert([chatLog])
      .select()
      .single();

    if (error) {
      console.error("Supabase error logging chat:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        error: {
          message: "Failed to log chat interaction",
          code: error.code,
          details: error.details,
        },
      };
    }

    console.log("Successfully inserted chat log with ID:", data?.id);
    return { error: null };
  } catch (err) {
    console.error("Unexpected error in logChat:", err);
    return {
      error: {
        message: "Unexpected error while logging chat",
        details: err,
      },
    };
  }
}

export async function validateDocumentAccess(
  userId: string,
  documentId: string
): Promise<ChatValidationResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("federal_documents")
      .select("doc_id")
      .eq("doc_id", documentId)
      .single();

    if (error) {
      return {
        valid: false,
        error: {
          message: "Document access validation failed",
          code: error.code,
          details: error.details,
        },
      };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: {
        message: "Unexpected error during document validation",
        details: err,
      },
    };
  }
}

export async function getChatHistory(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("chat_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chat history:", error);
      return {
        data: null,
        error: {
          message: "Failed to fetch chat history",
          code: error.code,
          details: error.details,
        },
      };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in getChatHistory:", err);
    return {
      data: null,
      error: {
        message: "Failed to fetch chat history",
        details: err,
      },
    };
  }
}

export async function deleteChatLog(userId: string, chatId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("chat_logs")
      .delete()
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) {
      return {
        error: {
          message: "Failed to delete chat log",
          code: error.code,
          details: error.details,
        },
      };
    }

    return { error: null };
  } catch (err) {
    return {
      error: {
        message: "Unexpected error while deleting chat log",
        details: err,
      },
    };
  }
}

export async function getDocumentChats(userId: string, documentId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("chat_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("document_id", documentId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        data: null,
        error: {
          message: "Failed to fetch document chats",
          code: error.code,
          details: error.details,
        },
      };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: {
        message: "Failed to fetch document chats",
        details: err,
      },
    };
  }
}
