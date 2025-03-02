"use client";

import React, { useState, useEffect } from "react";
import TransitionAd from "./components/TransitionAd"; // I hope this works

export default function StoriesClient() {
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
    return <p>Loading articles...</p>;
  }

  return (
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
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.97.24 2.67.51.73.28 1.34.66 1.95 1.27.61.61.99 1.22 1.27 1.95.27.7.45 1.5.51 2.67.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.06 1.17-.24 1.97-.51 2.67-.28.73-.66 1.34-1.27 1.95-.61.61-.99 1.22-1.27 1.95-.27.7-.45 1.5-.51 2.67-.06 1.27-.07 1.65-.07 4.85 0 3.2.01 3.58.07 4.85.06 1.17.24 1.97.51 2.67.28.73.66 1.34 1.27 1.95.61.61.99 1.22 1.27 1.95.27.7.45 1.5.51 2.67.06 1.27.07 1.65.07 4.85 0 3.2zm0 2.16c-3.09 0-3.47.01-4.68.07-.99.05-1.67.2-2.26.43-.61.23-1.13.56-1.65 1.08-.52.52-.85 1.04-1.08 1.65-.23.59-.38 1.27-.43 2.26-.06 1.21-.07 1.59-.07 4.68 0 3.09.01 3.47.07 4.68.05.99.2 1.67.43 2.26.23.61.56 1.13 1.08 1.65.52.52 1.04.85 1.65 1.08.59.23 1.27.38 2.26.43 1.21.06 1.59.07 4.68.07 3.09 0 3.47-.01 4.68-.07.99-.05 1.67-.2 2.26-.43.61-.23 1.13-.56 1.65-1.08.52-.52.85-1.04 1.08-1.65.23-.59.38-1.27.43-2.26.06-1.21.07-1.59.07-4.68 0-3.09-.01-3.47-.07-4.68-.05-.99-.2-1.67-.43-2.26-.23-.61-.56-1.13-1.08-1.65-.52-.52-1.04-.85-1.65-1.08-.59-.23-1.27-.38-2.26-.43-1.21-.06-1.59-.07-4.68-.07zm0 5.83a6.01 6.01 0 100 12.02 6.01 6.01 0 000-12.02zm0 9.86a3.85 3.85 0 110-7.7 3.85 3.85 0 010 7.7zm6.28-10.14a1.41 1.41 0 11-2.82 0 1.41 1.41 0 012.82 0z" fill="#fff"/>
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
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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