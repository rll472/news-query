// app/api/extract-article/route.js

import { createRequire } from 'module';

export async function POST(request) {
  try {
    // Parse the incoming JSON body to get the article URL.
    const { articleUrl } = await request.json();
    console.log("Extracting article for URL:", articleUrl);

    // Fetch the article's HTML content.
    const res = await fetch(articleUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch the article. Status: ${res.status}`);
    }
    const html = await res.text();

    // Use createRequire to import Unfluff (a CommonJS module).
    const require = createRequire(import.meta.url);
    const unfluff = require('unfluff');

    // Extract article data using Unfluff.
    const data = unfluff(html);
    console.log("Extraction result:", data);

    // Return the extracted article data as JSON.
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error extracting article:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
