// src/app/api/ingest-articles/route.js

export const config = { runtime: "nodejs" };

import { supabase } from "../../lib/supabaseClient";
import { extractAndStoreArticle } from "../../utils/articleExtractor";
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key is set:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(request) {
  try {
    const payload = await request.json();
    console.log("Received payload:", payload);
    const { article } = payload;
    const url = article.url || article.link;

    if (!article || !url) {
      return new Response(
        JSON.stringify({ error: "Article data missing or invalid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the article already exists (using URL as a unique identifier)
    const { data: existing, error: selectError } = await supabase
      .from("articles")
      .select("id")
      .eq("url", article.url)
      .maybeSingle();
    if (selectError) {
      console.error(`Error checking article ${article.url}:`, selectError.message);
      return new Response(
        JSON.stringify({ error: "Database error while checking article" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Article already exists" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract article content using your helper
    let content = "";
    try {
      content = await extractAndStoreArticle(article.url);
    } catch (extractionError) {
      console.error(`Error extracting content for ${article.url}:`, extractionError.message);
      // Optionally, you can choose to skip this article or proceed without content.
    }

    const { title, textContent } = article; // article is the parsed object from Readability
    const extractedContent = content || textContent || "";
    const source = new URL(url).hostname;
    const published_at = new Date().toISOString();
    const image_url = article.urlToImage || null;
    console.log("Image URL:", image_url);

    // Insert new article record into the database
    const { data, error: insertError } = await supabase.from('articles').insert([{
      url,
      title,
      source,
      published_at,
      content: extractedContent,
      image_url,
    }]);  


    if (insertError) {
      console.error(`Error inserting article ${article.url}:`, insertError.message);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }    

    return new Response(
      JSON.stringify({
        message: "Article ingested successfully",
        inserted,
      }),
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
