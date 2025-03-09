// src/app/chat/page.jsx
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Reusable Navbar component
function Navbar() {
  return (
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
              <path d="M7.75 2h8.5A5.25 5.25 0 0121.5 7.25v8.5A5.25 5.25 0 0116.25 21h-8.5A5.25 5.25 0 012.5 15.75v-8.5A5.25 5.25 0 017.75 2zm6.5 2.5h-4.5A5.25 5.25 0 004.5 9.75v4.5A5.25 5.25 0 009.75 19.5h4.5a5.25 5.25 0 005.25-5.25v-4.5A5.25 5.25 0 0014.25 4.5zm-2.25 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5-3.5a1 1 0 110 2 1 1 0 010-2z" fill="#fff"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const articleUrl = searchParams.get("articleUrl") || "";
  const articleTitle = searchParams.get("articleTitle") || "Unknown Title";
  const articleAuthor = searchParams.get("articleAuthor") || "Unknown Author";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, articleUrl }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        const responseContent = res.ok
          ? data.response
          : "Error: " + data.error;
        return [...updated, { role: "assistant", content: responseContent }];
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          { role: "assistant", content: "Error: " + err.message },
        ];
      });
    }
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <Link href="/news" style={styles.backLink}>
        Back to Stories
      </Link>
      <div style={styles.chatContainer}>
        <header style={styles.header}>
          <h1 style={styles.title}>Chat about {articleTitle}</h1>
          <p style={styles.meta}>
            <strong>Author:</strong> {articleAuthor} •{" "}
            <strong>URL:</strong> {articleUrl}
          </p>
        </header>
        <div style={styles.chatWindow}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={
                msg.role === "user"
                  ? styles.userBubble
                  : styles.assistantBubble
              }
            >
              {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Send
          </button>
        </form>
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
    padding: "0 0rem",
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
  backLink: {
    position: "fixed",
    top: "60px", // Below navbar
    left: "20px",
    fontSize: "0.9rem",
    color: "#666",
    textDecoration: "none",
    zIndex: 900, // Below navbar, above content
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  chatContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    paddingTop: "70px", // Offset for navbar + back link
  },
  header: {
    marginBottom: "1rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  meta: {
    fontSize: "0.9rem",
    color: "#666",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    backgroundColor: "#f7f7f8",
    borderRadius: "8px",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
    color: "white",
    padding: "0.75rem 1rem",
    borderRadius: "16px",
    margin: "0.5rem 0",
    maxWidth: "70%",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    color: "black",
    padding: "0.75rem 1rem",
    borderRadius: "16px",
    margin: "0.5rem 0",
    maxWidth: "70%",
  },
  form: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "20px",
    border: "1px solid #ccc",
    marginRight: "0.5rem",
  },
  button: {
    padding: "0.75rem 1.25rem",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#8B5CF6",
    color: "white",
    cursor: "pointer",
  },
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}