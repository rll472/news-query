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
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.97.24 2.67.51.73.28 1.34.66 1.95 1.27.61.61.99 1.22 1.27 1.95.27.7.45 1.5.51 2.67.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.06 1.17-.24 1.97-.51 2.67-.28.73-.66 1.34-1.27 1.95-.61.61-.99 1.22-1.27 1.95-.27.7-.45 1.5-.51 2.67-.06 1.27-.07 1.65-.07 4.85 0 3.2.01 3.58.07 4.85.06 1.17.24 1.97.51 2.67.28.73.66 1.34 1.27 1.95.61.61.99 1.22 1.27 1.95.27.7.45 1.5.51 2.67.06 1.27.07 1.65.07 4.85 0 3.2zm0 2.16c-3.09 0-3.47.01-4.68.07-.99.05-1.67.2-2.26.43-.61.23-1.13.56-1.65 1.08-.52.52-.85 1.04-1.08 1.65-.23.59-.38 1.27-.43 2.26-.06 1.21-.07 1.59-.07 4.68 0 3.09.01 3.47.07 4.68.05.99.2 1.67.43 2.26.23.61.56 1.13 1.08 1.65.52.52 1.04.85 1.65 1.08.59.23 1.27.38 2.26.43 1.21.06 1.59.07 4.68.07 3.09 0 3.47-.01 4.68-.07.99-.05 1.67-.2 2.26-.43.61-.23 1.13-.56 1.65-1.08.52-.52.85-1.04 1.08-1.65.23-.59.38-1.27.43-2.26.06-1.21.07-1.59.07-4.68 0-3.09-.01-3.47-.07-4.68-.05-.99-.2-1.67-.43-2.26-.23-.61-.56-1.13-1.08-1.65-.52-.52-1.04-.85-1.65-1.08-.59-.23-1.27-.38-2.26-.43-1.21-.06-1.59-.07-4.68-.07zm0 5.83a6.01 6.01 0 100 12.02 6.01 6.01 0 000-12.02zm0 9.86a3.85 3.85 0 110-7.7 3.85 3.85 0 010 7.7zm6.28-10.14a1.41 1.41 0 11-2.82 0 1.41 1.41 0 012.82 0z" fill="#fff"/>
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
      <Link href="/" style={styles.backLink}>
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
    backgroundColor: "#0084ff",
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
    backgroundColor: "#0084ff",
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