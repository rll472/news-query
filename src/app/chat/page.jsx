"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const articleTitle = searchParams.get("articleTitle") || "Unknown Title";
  const articleAuthor = searchParams.get("articleAuthor") || "Unknown Author";
  const articleUrl = searchParams.get("articleUrl");

  // State for the conversation messages, current input, and loading state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    // Add the user message to the conversation
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: { articleTitle, articleAuthor },
          articleUrl, // Ensure this is passed from the URL query
        }),
      });
      const data = await res.json();
      const assistantMessage = data.response || data.error;
      // Append the assistant's response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div style={styles.container}>
      {/* Header with article title and author */}
      <header style={styles.header}>
        <h1 style={styles.title}>{articleTitle}</h1>
        <p style={styles.author}>By {articleAuthor}</p>
      </header>
      {/* Chat conversation container */}
      <div style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "assistant"
                ? styles.assistantMessage
                : styles.userMessage
            }
          >
            {msg.content}
          </div>
        ))}
        {loading && <p style={styles.loading}>Loading response...</p>}
      </div>
      {/* Input field and Send button */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Ask a question..."
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "1rem",
  },
  header: {
    borderBottom: "1px solid #ccc",
    paddingBottom: "1rem",
    marginBottom: "1rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  author: {
    margin: 0,
    color: "#666",
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    backgroundColor: "#f2f2f2",
    borderRadius: "4px",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0070f3",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    marginBottom: "0.5rem",
    maxWidth: "80%",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e2e2",
    color: "#000",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    marginBottom: "0.5rem",
    maxWidth: "80%",
  },
  loading: {
    alignSelf: "center",
    color: "#666",
  },
  inputContainer: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "0.5rem",
  },
  sendButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "4px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
