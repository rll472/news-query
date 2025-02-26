"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient"; // adjust path if needed

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

// Summary content with "Ask a question" button
function SummaryContent() {
  const searchParams = useSearchParams();
  const articleUrl = searchParams.get("articleUrl");
  const articleTitle = searchParams.get("articleTitle");
  const articleAuthor = searchParams.get("articleAuthor");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleUrl }),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (articleUrl) {
      fetchSummary();
    }
  }, [articleUrl]);

  return (
    <div style={styles.contentContainer}>
      <h1>Article Summary</h1>
      {loading ? (
        <p>Loading summary...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>{summary}</p>
      )}
      {/* "Ask a question" button */}
      <div style={styles.buttonWrapper}>
        <Link
          href={`/chat?articleUrl=${encodeURIComponent(
            articleUrl
          )}&articleTitle=${encodeURIComponent(articleTitle || "")}&articleAuthor=${encodeURIComponent(
            articleAuthor || ""
          )}`}
        >
          <button style={styles.askButton}>Ask a question</button>
        </Link>
      </div>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <div>
      <Navbar />
      {/* Offset content by navbar height */}
      <div style={{ marginTop: "70px" }}>
        <Suspense fallback={<div>Loading summary page...</div>}>
          <SummaryContent />
        </Suspense>
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
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  contentContainer: {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    minHeight: "calc(100vh - 70px)",
  },
  buttonWrapper: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  askButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#8B5CF6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 300ms",
  },
};
