"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const articleUrl = searchParams.get("articleUrl");
  const articleTitle = searchParams.get("articleTitle") || "Unknown Title";
  const articleAuthor = searchParams.get("articleAuthor") || "Unknown Author";

  const [ingestStatus, setIngestStatus] = useState("");

  async function handleIngest() {
    await fetch("/api/ingest-articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleUrl,
        articleTitle,
        articleAuthor,
      }),
    });
    

    setIngestStatus("Ingesting article...");
    try {
      const res = await fetch("/api/ingest-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleUrl,
          articleTitle,
          articleAuthor,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setIngestStatus(`Success: ${data.message}`);
      } else {
        setIngestStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setIngestStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h1>{articleTitle}</h1>
      <h3>By {articleAuthor}</h3>
      <p>Article URL: {articleUrl}</p>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link
          href={`/summary?articleUrl=${encodeURIComponent(
            articleUrl
          )}&articleTitle=${encodeURIComponent(articleTitle)}&articleAuthor=${encodeURIComponent(
            articleAuthor
          )}`}
        >
          <button>Summary</button>
        </Link>
        <Link
          href={`/chat?articleUrl=${encodeURIComponent(
            articleUrl
          )}&articleTitle=${encodeURIComponent(articleTitle)}&articleAuthor=${encodeURIComponent(
            articleAuthor
          )}`}
        >
          <button>Chat</button>
        </Link>
        <button onClick={handleIngest}>Test Ingest Article</button>
      </div>
      {ingestStatus && <p>{ingestStatus}</p>}
    </div>
  );
}
