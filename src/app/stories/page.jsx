"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Stories() {
  const [articles, setArticles] = useState([]);
  const [ingestStatus, setIngestStatus] = useState("");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/newsdatahub", { cache: "no-store" });
        const data = await res.json();
        // Update to use data.articles (News API returns articles in the "articles" property)
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    fetchArticles();
  }, []);

  async function handleIngest(article) {
    try {
      const response = await fetch("/api/ingest-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error ingesting article:", error);
    }
  }

  return (
    <div style={styles.container}>
      {articles.map((article, index) => (
        <div key={article.url || article.link || index} style={styles.card}>
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              style={styles.thumbnail}
            />
          )}
          <div style={styles.content}>
            <h2 style={styles.title}>
              <a
                href={article.url || article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {article.title}
              </a>
            </h2>
            <p style={styles.description}>{article.description}</p>
            <small style={styles.meta}>
              {new Date(article.pubDate).toLocaleString()} - {article.source?.name}
            </small>
            <div style={styles.buttonContainer}>
              <Link
                href={`/summary?articleUrl=${encodeURIComponent(
                  article.url || article.link
                )}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(
                  Array.isArray(article.creator)
                    ? article.creator.join(", ")
                    : article.creator || ""
                )}`}
              >
                <button style={styles.summaryButton}>Summary</button>
              </Link>
              <Link
                href={`/chat?articleUrl=${encodeURIComponent(
                  article.url || article.link
                )}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(
                  Array.isArray(article.creator)
                    ? article.creator.join(", ")
                    : article.creator || ""
                )}`}
              >
                <button style={styles.chatButton}>Chat</button>
              </Link>
              <button
                style={styles.ingestButton}
                onClick={() => handleIngest(article)}
              >
                Test Ingest Article
              </button>
            </div>
          </div>
        </div>
      ))}
      {ingestStatus && <p>{ingestStatus}</p>}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    overflowY: "scroll",
    padding: "0.5rem",
    backgroundColor: "#f9f9f9",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    marginBottom: "0.5rem",
    padding: "0.5rem",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  thumbnail: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "4px",
    marginRight: "0.5rem",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "1rem",
    margin: "0.2rem 0",
  },
  // The link style inherits the surrounding text color
  link: {
    color: "inherit",
    textDecoration: "none",
  },
  description: {
    fontSize: "0.8rem",
    margin: "0.2rem 0",
  },
  meta: {
    fontSize: "0.7rem",
    color: "#666",
  },
  buttonContainer: {
    marginTop: "0.5rem",
    display: "flex",
    gap: "0.5rem",
  },
  summaryButton: {
    flex: 1,
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  chatButton: {
    flex: 1,
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
    backgroundColor: "#00a884",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  ingestButton: {
    flex: 1,
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
    backgroundColor: "#ffaa00",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
