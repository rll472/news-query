// app/api/chat/route.ts

export const config = {
  runtime: 'nodejs',
};

import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { supabase } from '../lib/supabaseClient';

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
        content: `Below is the article information:
Article Title: ${article.title || context.articleTitle || 'Unknown Title'}
Article Author: ${article.author || context.articleAuthor || 'Unknown Author'}
Article Content:
${articleContent || 'No article content available.'}

Please use this information to answer the following question.`,
      },
      {
        role: 'user',
        content: `User question: ${message}`,
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
