// app/api/chat/route.js

// Tell Next.js to use the Node.js runtime.
export const config = {
  runtime: 'nodejs',
};

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    console.log("Received chat request.");

    // Parse the incoming request body.
    const { message, context } = await request.json();
    console.log("User message:", message);
    console.log("Context:", context);

    // Build the conversation for the chat completions endpoint.
    // We use a system message to provide context and a user message with the actual question.
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant. The context for this conversation is: Title: ${context.articleTitle || "Unknown Title"}, Author: ${context.articleAuthor || "Unknown Author"}.`,
      },
      {
        role: "user",
        content: message,
      },
    ];
    console.log("Messages for chat completions:", messages);

    // Call the OpenAI Chat Completions API using the new interface.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages,
      max_tokens: 150,
    });
    console.log("OpenAI response:", completion);

    // Extract the response message.
    const chatResponse = completion.choices[0].message.content.trim();
    console.log("Chat response generated:", chatResponse);

    return new Response(JSON.stringify({ response: chatResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
