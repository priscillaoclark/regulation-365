import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    // Create a Supabase client
    const supabase = createClient();

    // Fetch data from the "cfpb" table
    const { data: ea_cfpb, error } = await supabase
      .from("ea_cfpb")
      .select()
      .limit(10);

    // If there's an error with the query, log it and return an error response
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Supabase" },
        { status: 500 }
      );
    }

    // If the query is successful, return the data as JSON
    return NextResponse.json(ea_cfpb);
  } catch (err) {
    // Log any unexpected errors
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
