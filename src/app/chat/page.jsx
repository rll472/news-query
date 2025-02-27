"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Reusable Navbar component
function Navbar() {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContent}>
        <span style={styles.navTitle}>NewsChat.io</span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
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

    // Append the user's message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");

    // Append a temporary assistant placeholder message
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, articleUrl }),
      });
      const data = await res.json();

      setMessages((prev) => {
        // Remove the temporary placeholder
        const updated = prev.slice(0, -1);
        // Append the real assistant response or error
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
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "1rem",
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
