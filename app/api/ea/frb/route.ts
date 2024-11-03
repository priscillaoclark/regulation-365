import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Calculate the range start and end
    const rangeStart = (page - 1) * pageSize;
    const rangeEnd = rangeStart + pageSize - 1;

    const supabase = createClient();

    // First, get total count
    const { count } = await supabase
      .from("ea_frb")
      .select("*", { count: "exact", head: true });

    // Then get paginated data
    const { data: ea_frb, error } = await supabase
      .from("ea_frb")
      .select()
      .order("effective_date", { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: ea_frb,
      metadata: {
        totalCount: count,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
