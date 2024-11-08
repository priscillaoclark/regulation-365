// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, documentId } = await req.json();

    // First, fetch document details from Supabase
    const supabase = createClient();
    const { data: document, error } = await supabase
      .from("federal_documents")
      .select("*")
      .eq("doc_id", documentId)
      .single();

    if (error || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Generate embeddings for the user's query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    // Get the index with namespace
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);
    const indexWithNamespace = index.namespace("federal-documents");

    // Query Pinecone with metadata filtering
    const results = await indexWithNamespace.query({
      vector: embedding,
      topK: 5,
      filter: {
        filename: documentId, // Using filename field to match doc_id
      },
      includeMetadata: true,
    });

    // Log results for debugging
    console.log("Pinecone results:", {
      matchCount: results.matches.length,
      firstMatch: results.matches[0],
      metadata: results.matches.map((m) => m.metadata),
    });

    // Create a comprehensive system prompt
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
    5. Only make statements that are directly supported by the document content`;

    // Generate chat response
    const chatResponse = await openai.chat.completions.create({
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

    // Log for debugging
    console.log("Query details:", {
      documentId,
      messageEmbeddingLength: embedding.length,
      matchCount: results.matches.length,
      systemPromptLength: systemPrompt.length,
      response: chatResponse.choices[0].message?.content,
    });

    return NextResponse.json({
      response: chatResponse.choices[0].message?.content,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
