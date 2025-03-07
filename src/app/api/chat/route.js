// src/app/api/chat/route.js

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

    // **START:  Summarization Logic (Adapted from your summary API)**

    // Build the prompt for summarization, grabbing the prompt from the summary api.
    const prompt = `Summarize the following article with only the most relevant information contained in the article.  Include any details that are included in the article that are factual and might be relevant to the story without being redundant.  Include any direct quotes provided by the main characters of the story.' :
    Article Title: ${article.title || "Unknown Title"}
    Article Author: ${article.author || "Unknown Author"}
    Article Content:
    ${articleContent || "No article content available."}`;


    // Call OpenAI's Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 250,
    });

    const summary = completion.choices[0].message.content.trim();
    // **END: Summarization Logic**

    // Use the summary as the article content for the chat.
    const summarizedArticleContent = summary;

    // Build the messages array for the Chat Completions API.
    const messages = [
      {
        role: 'system',
        content: `You are a news assistant. The following is a summary of a news article. Use only this summary, to answer the user's question. Take notice of the people and / or organizations discussed or mentioned, and be prepared to answer questions about them.  If there is a quote inside "", take note of what was said and who said it.  Do not incorporate any outside knowledge.
        
Summary:
${summarizedArticleContent || "No article content available."}`,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    // Call the Chat Completions API.
    const completion2 = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages,
      max_tokens: 150,
    });

    // Extract and trim the assistant's response.
    const chatResponse = completion2.choices[0].message.content.trim();

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