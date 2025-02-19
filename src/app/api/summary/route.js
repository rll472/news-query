import { createRequire } from 'module';

export async function POST(request) {
  try {
    console.log("Received summary request.");

    // Parse the request body
    const { articleUrl } = await request.json();
    console.log("Article URL received:", articleUrl);

    // Construct an excerpt or snippet of the article
    const articleContent = `Here is the content (or excerpt) of the article from: ${articleUrl}`;
    console.log("Article content prepared:", articleContent);

    // Use createRequire to import the OpenAI module via CommonJS
    const require = createRequire(import.meta.url);
    const openaiModule = require("openai");
    console.log("OpenAI module imported via require:", openaiModule);

    if (!openaiModule || !openaiModule.Configuration || !openaiModule.OpenAIApi) {
      throw new Error("Failed to import OpenAI module constructors using require.");
    }

    const { Configuration, OpenAIApi } = openaiModule;

    // Initialize the OpenAI client
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    console.log("OpenAI client initialized.");

    // Build the prompt for summarization
    const prompt = `Using the following article text in three concise sentences:\n\n${articleContent}`;
    console.log("Prompt for OpenAI:", prompt);

    // Call the OpenAI API
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });
    console.log("OpenAI response:", completion.data);

    const summary = completion.data.choices[0].text.trim();
    console.log("Generated summary:", summary);

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in summary API route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
