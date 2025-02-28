// app/api/summary/route.ts

export const config = {
  runtime: "nodejs",
};

//import { NextRequest } from "next/server"; *Commented out until you need to use
import { OpenAI } from "openai";
import { supabase } from "../../lib/supabaseClient";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the request body which should include articleUrl and context
    const { articleUrl, context } = await request.json();
    console.log("Article URL received:", articleUrl);

    // Query the database for the article by URL
    const { data: article, error: dbError } = await supabase
    .from("articles")
    .select("content, title, author")
    .eq("url", articleUrl)
    .maybeSingle();
    console.log("Database article:", article);


    if (dbError) throw new Error(dbError.message);
    if (!article) throw new Error("Article not found in the database.");

    // Use the content from the database
    const articleContent = article.content;

    // Build the prompt for summarization
    // Build the prompt for summarization
    const prompt = `Summarize the following article with only the most relevant information contained in the article.  Include any details that are included in the article that are factual and might be relevant to the story without being redundant.  Include any direct quotes provided by the main characters of the story.' :
    Article Title: ${article.title || context?.articleTitle || "Unknown Title"}
    Article Author: ${article.author || context?.articleAuthor || "Unknown Author"}
    Article Content:
    ${articleContent || "No article content available."}`;


    // Call OpenAI's Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content.trim();

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in summary API route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
