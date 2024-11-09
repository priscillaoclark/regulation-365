// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createClient } from "@/utils/supabase/server";
import { logChat, validateDocumentAccess } from "@/utils/chat";
import { handleChatError } from "@/utils/errors";
import { ChatLog, ChatError, ChatValidationResult } from "@/types/chat";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("Starting chat request processing");
    const { message, documentId } = await req.json();

    if (!message?.trim() || !documentId?.trim()) {
      return NextResponse.json(
        { error: "Message and document ID are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated user found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate document access
    const { valid, error: validationError } = await validateDocumentAccess(
      user.id,
      documentId
    );
    if (!valid) {
      console.log("Document access validation failed:", validationError);
      return NextResponse.json(
        { error: validationError?.message || "Invalid document access" },
        { status: 403 }
      );
    }

    // Fetch document details
    console.log("Fetching document details:", { documentId });
    const { data: document, error: docError } = await supabase
      .from("federal_documents")
      .select("*")
      .eq("doc_id", documentId)
      .single();

    if (docError || !document) {
      console.error("Error fetching document:", docError);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
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
      return NextResponse.json(
        { error: "Failed to process query" },
        { status: 500 }
      );
    }

    // Initialize Pinecone
    console.log("Initializing Pinecone query with params:", {
      documentId,
      namespace: "federal-documents",
      vectorDimensions: embedding.length,
    });

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);
    const indexWithNamespace = index.namespace("federal-documents");

    // Query Pinecone with more detailed parameters
    const queryParams = {
      vector: embedding,
      topK: 5,
      filter: {
        filename: documentId,
      },
      includeMetadata: true,
    };

    console.log("Executing Pinecone query with filter:", queryParams.filter);
    const results = await indexWithNamespace.query(queryParams);

    console.log("Pinecone query results:", {
      matchCount: results.matches.length,
      matchScores: results.matches.map((m) => m.score),
      hasMetadata: results.matches.some((m) => m.metadata),
      namespace: "federal-documents",
    });

    if (results.matches.length === 0) {
      console.log("No matches found. Verifying document existence:", {
        documentId,
        indexName: process.env.PINECONE_INDEX_NAME,
        namespace: "federal-documents",
      });
    }

    // Create system prompt
    const systemPrompt = `You are an AI assistant helping with questions about a specific federal document.
    
    DOCUMENT CONTEXT:
    Title: ${document.title}
    Agency: ${document.agencyId}
    Type: ${document.documentType}
    Date: ${document.postedDate}
    
    RELEVANT SECTIONS:
    ${results.matches.map((match) => match.metadata?.text || "").join("\n\n")}

    Instructions:
    1. Base your responses on the provided document sections above
    2. If specific information is found in the text, cite or quote it
    3. If you cannot find relevant information in the provided sections, say so
    4. Be precise and factual when discussing the document's content
    5. Only make statements that are directly supported by the document content
    ${results.matches.length === 0 ? "6. Note: No specific document sections were found for this query. Provide a general response based on the document metadata." : ""}`;

    // Generate chat response
    console.log("Generating chat response");
    let chatResponse;
    try {
      chatResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      });

      console.log("Chat response generated successfully", {
        tokensUsed: chatResponse.usage?.total_tokens,
        promptTokens: chatResponse.usage?.prompt_tokens,
        completionTokens: chatResponse.usage?.completion_tokens,
      });
    } catch (error) {
      console.error("Error generating chat response:", error);
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    const response = chatResponse.choices[0].message?.content;

    if (!response) {
      console.error("No response generated from OpenAI");
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    // Log chat
    try {
      console.log("Preparing to log chat interaction");
      const chatLog: Omit<ChatLog, "id" | "created_at"> = {
        user_id: user.id,
        chat_type: "document",
        document_id: documentId,
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
          documentId: documentId,
        });
      } else {
        console.log("Successfully logged chat interaction");
      }
    } catch (error) {
      console.error("Unexpected error during chat logging:", error);
    }

    // Return successful response
    console.log("Sending successful response");
    return NextResponse.json({
      response,
      metadata: {
        matchCount: results.matches.length,
        tokensUsed: chatResponse.usage?.total_tokens,
        embeddingDimensions: embedding.length,
        hasRelevantSections: results.matches.length > 0,
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
      { status: 500 }
    );
  }
}
