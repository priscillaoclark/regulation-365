import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { message } = await req.json();

  // Generate embeddings
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });
  const embedding = embeddingResponse.data[0].embedding;
  console.log("Generated embedding:", embedding);

  // Initialize Pinecone client without init
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  // Retrieve the specific index by name
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);

  // Check the embedding and index name before querying
  // console.log("Querying Pinecone index:", index, "with embedding:", embedding);

  const indexWithNamespace = index.namespace("major-regs");

  // Query the Pinecone index with the namespace applied
  const results = await indexWithNamespace.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  console.log("Initial pinecone query results:", results);

  // Generate a chatbot response based on the Pinecone results
  console.log("Results passed to chat model:", results);
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: message },
      {
        role: "system",
        content: `Only use vector store knowledge to answer the question. Don't make anything up. If you don't know the answer, tell the user that you don't know. Here are the results from the Pinecone query: ${JSON.stringify(results)}`,
      },
    ],
  });
  console.log("Chat response:", chatResponse);

  return NextResponse.json({
    response: chatResponse.choices[0].message?.content,
  });
}
