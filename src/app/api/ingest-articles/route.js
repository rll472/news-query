// src/app/api/ingest-articles/route.js

export const config = { runtime: "nodejs" };

import { supabase } from "../../lib/supabaseClient";
import { extractArticle } from "../../utils/articleExtractor"; // Updated import

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key is set:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(request) {
  try {
    const payload = await request.json();
    console.log("Received payload:", payload);
    const { article } = payload;
    const url = article.url || article.link;

    console.log("Ingestion attempt:", new Date().toISOString(), url); // Already present, kept as is

    if (!article || !url) {
      return new Response(
        JSON.stringify({ error: "Article data missing or invalid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: existing, error: selectError } = await supabase
      .from("articles")
      .select("id, image_url")
      .eq("url", article.url)
      .maybeSingle();
    if (selectError) {
      console.error(`Error checking article ${article.url}:`, selectError.message);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    if (existing) {
      console.log(`Article already exists: ${article.url}, image_url: ${existing.image_url}`);
      return new Response(
        JSON.stringify({ message: "Article already exists" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    let extracted;
    try {
      extracted = await extractArticle(article.url); // Use the renamed function
      console.log("Raw extracted content:", extracted.content?.length > 0 ? extracted.content.slice(0, 200) : "Empty or not a string");
    } catch (extractionError) {
      console.error(`Error extracting content for ${article.url}:`, extractionError.message);
      extracted = { content: article.content || "Content extraction failed" }; // Fallback if extraction fails
    }

    const { title, textContent } = article;
    const extractedContent = extracted.content || textContent || "Content unavailable"; // Ensure non-empty
    console.log("Final extractedContent:", extractedContent.slice(0, 200));

    const source = new URL(url).hostname;
    const published_at = new Date().toISOString();
    const image_url = extracted.image_url || article.urlToImage || null; // Prefer extracted image_url, fallback to payload
    console.log("Image URL:", image_url);

    const insertData = {
      url,
      title: extracted.title || title, // Use extracted title if available
      source,
      published_at,
      content: extractedContent,
      image_url
    };
    console.log("Payload sent to Supabase:", JSON.stringify(insertData, null, 2));
    const { data: inserted, error: insertError } = await supabase
      .from("articles")
      .insert([insertData])
      .select();

    console.log("Inserted data from Supabase:", JSON.stringify(inserted, null, 2));
    console.log("Inserting article with image_url:", image_url);

    if (insertError) {
      console.error(`Error inserting article ${article.url}:`, insertError.message);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Article ingested successfully", inserted }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ingestion API route:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}