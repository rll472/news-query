// app/api/newsdatahub/route.js

export const config = { runtime: "nodejs" };

export async function GET(request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch from NewsDataHub: ${res.statusText}`);
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching NewsDataHub data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
