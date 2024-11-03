// app/api/details/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    // Create a Supabase client
    const supabase = createClient();

    console.log("Attempting to fetch data from federal_documents");

    // Updated to use camelCase column names to match the database
    const { data: federal_documents, error } = await supabase
      .from("federal_documents")
      .select(
        `
        doc_id,
        title,
        agencyId,
        documentType,
        postedDate,
        modifyDate,
        receiveDate,
        withdrawn,
        docketId,
        openForComment,
        commentStartDate,
        commentEndDate,
        frDocNum,
        objectId,
        topics,
        files,
        relevant,
        summary,
        keywords
      `
      )
      .order("postedDate", { ascending: false });

    console.log("Query result:", {
      hasData: !!federal_documents,
      dataLength: federal_documents?.length,
      error,
    });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Supabase" },
        { status: 500 }
      );
    }

    if (!federal_documents) {
      console.log("No data returned from query");
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    // No need to transform case since the database already uses camelCase
    const transformedData = federal_documents.map((doc) => ({
      doc_id: doc.doc_id, // only transform docId to doc_id as needed by frontend
      title: doc.title,
      agencyId: doc.agencyId,
      documentType: doc.documentType,
      postedDate: doc.postedDate,
      modifyDate: doc.modifyDate,
      receiveDate: doc.receiveDate,
      withdrawn: doc.withdrawn,
      docketId: doc.docketId,
      openForComment: doc.openForComment,
      commentStartDate: doc.commentStartDate,
      commentEndDate: doc.commentEndDate,
      frDocNum: doc.frDocNum,
      objectId: doc.objectId,
      topics: doc.topics,
      files: doc.files,
      relevant: doc.relevant ?? false,
      summary: doc.summary,
      keywords: doc.keywords,
    }));

    console.log("Transformed data length:", transformedData.length);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    if (err instanceof Error) {
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    console.log("Processing PUT request");

    const body = await request.json();
    const { doc_id, relevant } = body;

    console.log("PUT request body:", { doc_id, relevant });

    if (typeof relevant !== "boolean" || !doc_id) {
      return NextResponse.json(
        { error: "Invalid request body. Required: doc_id and relevant status" },
        { status: 400 }
      );
    }

    // Update using docId instead of doc_id to match database column name
    const { data, error } = await supabase
      .from("federal_documents")
      .update({ relevant })
      .eq("docId", doc_id) // Changed from doc_id to match database column name
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update relevant status" },
        { status: 500 }
      );
    }

    console.log("Update successful:", data);

    // Transform the response to match frontend expectations
    const transformedData = data?.[0]
      ? {
          doc_id: data[0].docId,
          ...data[0],
        }
      : null;

    return NextResponse.json(transformedData, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in PUT request:", err);
    if (err instanceof Error) {
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
