// src/app/api/chat/route.js

export const config = {
  runtime: 'nodejs',
};

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../lib/supabaseClient';

// Initialize the Gemini client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash-lite"}); // Or "gemini-1.5-pro"

export async function POST(request) {
  try {
    // Expect a JSON payload with message (user question) and articleUrl.
    const { message, articleUrl } = await request.json();

    // Query the database for the article by URL.
    const { data: article, error: dbError } = await supabase
      .from('articles')
      .select('content, title, author')
      .eq('url', articleUrl)
      .maybeSingle();

    if (dbError) {
      throw new Error(dbError.message);
    }
    if (!article) {
      throw new Error('Article not found in the database.');
    }

    // Use the content from the database.
    const articleContent = article.content;

    // **REMOVED: Summarization Logic**  No longer needed

    // Build the prompt for the Chat Completions API using the full article
    const chatPrompt = `You are a news assistant. The following is the full text of a news article. Use ONLY this article content to answer the user's question. Do not use any external knowledge. Take notice of the people and/or organizations discussed or mentioned, and be prepared to answer questions about them. If there is a quote inside "", take note of what was said and who said it. If the answer cannot be found within the article, please respond, "I'm sorry, but I could not find the answer to your question in the article. Please rephrase your question or check the article for more information."

    Article:
    ${articleContent || "No article content available."}

    User Question: ${message}`;

    // Call the Gemini API for Chat
    const chatResult = await model.generateContent(chatPrompt);
    const chatResponse = chatResult.response.text();

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