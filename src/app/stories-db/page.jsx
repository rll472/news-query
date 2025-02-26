"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient"; // adjust path as needed

export default function StoriesDB() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // For example, redirect to the login page or homepage.
      // You can adjust this as needed.
      window.location.href = "/";
    }
  }

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        const data = await res.json();
        // We expect the API to return { articles: [...] }
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles from DB:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  return (
    <div>
      {/* Sticky Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <span style={styles.navTitle}>Newsfeed</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      {/* Stories container with top margin to account for fixed navbar */}
      <div style={styles.container}>
        {articles.map((article, index) => (
          <div key={article.url || index} style={styles.card}>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                style={styles.thumbnail}
              />
            )}
            <div style={styles.content}>
              <h2 style={styles.title}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {article.title}
                </a>
              </h2>
              <p style={styles.description}>{article.description}</p>
              <small style={styles.meta}>
                {new Date(article.published_at).toLocaleString()} -{" "}
                {article.source}
              </small>
              <div style={styles.buttonContainer}>
                <Link
                  href={`/summary?articleUrl=${encodeURIComponent(
                    article.url
                  )}&articleTitle=${encodeURIComponent(
                    article.title
                  )}&articleAuthor=${encodeURIComponent(article.author || "")}`}
                >
                  <button style={styles.summaryButton}>Summary</button>
                </Link>
                <Link
                  href={`/chat?articleUrl=${encodeURIComponent(
                    article.url
                  )}&articleTitle=${encodeURIComponent(
                    article.title
                  )}&articleAuthor=${encodeURIComponent(article.author || "")}`}
                >
                  <button style={styles.chatButton}>Chat</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  navbarContent: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1rem",
  },
  navTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ff4136",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  container: {
    marginTop: "70px", // Account for the fixed navbar height + some spacing
    height: "calc(100vh - 70px)",
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
};
