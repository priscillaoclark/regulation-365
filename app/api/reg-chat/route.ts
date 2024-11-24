import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createClient } from "@/utils/supabase/server";
import { logChat } from "@/utils/chat";
import { handleChatError, ChatServiceError } from "@/utils/errors";
import { ChatLog } from "@/types/chat";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("Starting regulatory chat request processing");
    const { message } = await req.json();

    if (!message?.trim()) {
      throw new ChatServiceError("Message is required", "INVALID_REQUEST");
    }

    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated user found");
      throw new ChatServiceError("Authentication required", "UNAUTHORIZED");
    }

    // Generate embeddings
    let embedding: number[];
    try {
      console.log("Generating embedding for message");
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: message,
        encoding_format: "float",
      });
      embedding = embeddingResponse.data[0].embedding;
      console.log(`Generated embedding with ${embedding.length} dimensions`);
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new ChatServiceError(
        "Failed to process query",
        "EMBEDDING_ERROR",
        error
      );
    }

    // Initialize Pinecone client
    console.log("Initializing Pinecone");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    // Retrieve the specific index by name
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);
    const indexWithNamespace = index.namespace("major-regs");

    // Query the Pinecone index with the namespace applied
    console.log("Querying Pinecone");
    const results = await indexWithNamespace.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });

    console.log("Pinecone query results:", {
      matchCount: results.matches.length,
      matchScores: results.matches.map((m) => m.score),
      hasMetadata: results.matches.some((m) => m.metadata),
    });

    // Generate a chatbot response based on the Pinecone results
    console.log("Generating chat response");
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping with questions about major financial regulations.
          Base your responses initially on the provided content from our knowledge base.
          If you cannot find relevant information, use your other resources, but say you are doing so.
          Be precise and factual in your responses.
          
          Here are the results from the Pinecone query: ${JSON.stringify(results)} `,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const response = chatResponse.choices[0].message?.content;

    if (!response) {
      throw new ChatServiceError(
        "Failed to generate response",
        "NO_RESPONSE",
        "OpenAI response was empty"
      );
    }

    // Log chat
    try {
      console.log("Logging chat interaction");
      const chatLog: Omit<ChatLog, "id" | "created_at"> = {
        user_id: user.id,
        chat_type: "regulation",
        document_id: undefined,
        prompt: message,
        response: response,
        embedding: embedding,
        tokens_used: chatResponse.usage?.total_tokens,
      };

      const { error: logError } = await logChat(chatLog);

      if (logError) {
        console.error("Error logging chat:", {
          error: logError,
          embeddingLength: embedding.length,
          userId: user.id,
        });
      } else {
        console.log("Successfully logged chat interaction");
      }
    } catch (error) {
      console.error("Unexpected error during chat logging:", error);
      // Continue with response even if logging fails
    }

    // Return successful response
    console.log("Sending successful response");
    return NextResponse.json({
      response,
      metadata: {
        matchCount: results.matches.length,
        tokensUsed: chatResponse.usage?.total_tokens,
        embeddingDimensions: embedding.length,
        topMatchScore: results.matches[0]?.score || null,
      },
    });
  } catch (error) {
    const handledError = handleChatError(error);
    console.error("Chat error:", handledError);

    return NextResponse.json(
      {
        error: handledError.message,
        details:
          process.env.NODE_ENV === "development"
            ? handledError.details
            : undefined,
      },
      { status: error instanceof ChatServiceError ? 400 : 500 }
    );
  }
}
