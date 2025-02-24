// app/api/chat/route.ts

export const config = {
  runtime: 'nodejs',
};

import { OpenAI } from 'openai';
import { supabase } from '../../lib/supabaseClient';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the request body; expect a JSON payload with:
    // message (user question), context (e.g. article title/author), and articleUrl.
    const { message, context, articleUrl } = await request.json();

    // Query the database for the article by URL.
    const { data: article, error: dbError } = await supabase
    .from("articles")
    .select("content, title, author")
    .eq("url", articleUrl)
    .maybeSingle();

    if (dbError) throw new Error(dbError.message);
    if (!article) throw new Error('Article not found in the database.');

    // Use the content from the database.
    const articleContent = article.content;

    // Build the messages array for the Chat Completions API.
    const messages = [
      {
        role: 'system',
        content: `You are a news assistant. The following is the content of a news article. Use only this information to answer the user's question. Do not incorporate any outside knowledge.
        
    Article:
    ${articleContent || "No article content available."}`
      },
      {
        role: 'user',
        content: message,  // The user's question
      },
    ];    

    // Call the Chat Completions API.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages,
      max_tokens: 150,
    });

    // Extract the assistant's response.
    const chatResponse = completion.choices[0].message.content.trim();

    return new Response(JSON.stringify({ response: chatResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {

    console.error('Error in chat API route:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
