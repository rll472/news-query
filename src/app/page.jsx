// src/app/page.jsx
"use client";

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
     crossorigin="anonymous"></script>

import React, { useState, useEffect } from "react";
import Head from "next/head"; // Add this import
import TransitionAd from "./components/TransitionAd";

export const dynamic = "force-dynamic";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles from DB:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleAction = (article, type) => {
    const adShown = sessionStorage.getItem(`ad_shown_${article.url}`);
    if (!adShown) {
      setSelectedArticle(article);
      setAction(type);
      setShowAd(true);
    } else {
      window.location.href = type === 'summary'
        ? `/summary?articleUrl=${encodeURIComponent(article.url)}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(article.author || "")}`
        : `/chat?articleUrl=${encodeURIComponent(article.url)}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(article.author || "")}`;
    }
  };

  const onAdComplete = () => {
    sessionStorage.setItem(`ad_shown_${selectedArticle.url}`, 'true');
    setShowAd(false);
    const url = action === 'summary'
      ? `/summary?articleUrl=${encodeURIComponent(selectedArticle.url)}&articleTitle=${encodeURIComponent(selectedArticle.title)}&articleAuthor=${encodeURIComponent(selectedArticle.author || "")}`
      : `/chat?articleUrl=${encodeURIComponent(selectedArticle.url)}&articleTitle=${encodeURIComponent(selectedArticle.title)}&articleAuthor=${encodeURIComponent(selectedArticle.author || "")}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <>
        <Head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <p>Loading articles...</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div>
        <nav style={styles.navbar}>
          <div style={styles.navbarContent}>
            <span style={styles.navTitle}>NewsChat.io</span>
            <div style={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.01 3.67 9.16 8.47 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99c4.8-.72 8.47-4.87 8.47-9.88 0-5.5-4.46-9.96-9.96-9.96z" fill="#fff"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.536-11.464a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.536 1.464c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" fill="#fff"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
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
                  <button
                    onClick={() => handleAction(article, 'summary')}
                    style={styles.summaryButton}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => handleAction(article, 'chat')}
                    style={styles.chatButton}
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showAd && <TransitionAd onComplete={onAdComplete} />}
      </div>
    </>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    color: "#fff",
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    textDecoration: "none",
  },
  container: {
    marginTop: "70px",
    padding: "0.5rem",
    backgroundColor: "#f9f9f9",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    minHeight: "calc(100vh - 70px)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "0.5rem",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "row",
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
    backgroundColor: "#8B5CF6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};