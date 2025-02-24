// src/app/api/articles/route.js

export const config = { runtime: "nodejs" };

import { supabase } from "../../lib/supabaseClient";

export async function GET(request) {
  try {
    // Query the database for all articles; you can adjust filtering or ordering as needed
    const { data: articles, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ articles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching articles from database:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
