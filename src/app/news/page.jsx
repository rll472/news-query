// src/app/news/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../page.module.css"; 

export const dynamic = "force-dynamic";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const url = type === "summary"
      ? `/summary?articleUrl=${encodeURIComponent(article.url)}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(article.author || "")}`
      : `/chat?articleUrl=${encodeURIComponent(article.url)}&articleTitle=${encodeURIComponent(article.title)}&articleAuthor=${encodeURIComponent(article.author || "")}`;
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
        <nav className={styles.navbar}>
          <div className={styles.navbarContent}>
            <span className={styles.navTitle}>NewsChat.io</span>
            <div className={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.01 3.67 9.16 8.47 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99c4.8-.72 8.47-4.87 8.47-9.88 0-5.5-4.46-9.96-9.96-9.96z" fill="#fff"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.75 2h8.5A5.25 5.25 0 0121.5 7.25v8.5A5.25 5.25 0 0116.25 21h-8.5A5.25 5.25 0 012.5 15.75v-8.5A5.25 5.25 0 017.75 2zm6.5 2.5h-4.5A5.25 5.25 0 004.5 9.75v4.5A5.25 5.25 0 009.75 19.5h4.5a5.25 5.25 0 005.25-5.25v-4.5A5.25 5.25 0 0014.25 4.5zm-2.25 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5-3.5a1 1 0 110 2 1 1 0 010-2z" fill="#fff"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
        <div className={styles.container}>
          {articles.map((article, index) => (
            <div key={article.url || index} className={styles.card}>
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className={styles.thumbnail}
                />
              )}
              <div className={styles.content}>
                <h2 className={styles.title}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {article.title}
                  </a>
                </h2>
                <p className={styles.description}>{article.description}</p>
                <small className={styles.meta}>
                  {new Date(article.published_at).toLocaleString()} -{" "}
                  {article.source}
                </small>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => handleAction(article, "summary")}
                    className={styles.summaryButton}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => handleAction(article, "chat")}
                    className={styles.chatButton}
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}