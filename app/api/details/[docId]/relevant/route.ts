// app/api/details/[docId]/relevant/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { docId: string } }
) {
  try {
    const supabase = createClient();
    const docId = params.docId;
    const body = await request.json();
    const { relevant } = body;

    if (typeof relevant !== "boolean") {
      return NextResponse.json(
        { error: "Invalid relevant status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("federal_documents")
      .update({ relevant })
      .eq("doc_id", docId)
      .select("doc_id, relevant")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Record not found
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
