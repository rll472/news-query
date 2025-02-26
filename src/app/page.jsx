"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for an existing session and listen for auth state changes.
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    }
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/stories-db");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // Handle user signup.
  async function handleSignup() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      // Redirection handled via auth state change.
    }
    setLoading(false);
  }

  // Handle user login.
  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      // Redirection handled via auth state change.
    }
    setLoading(false);
  }

  // Handle user logout.
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
      router.push("/");
    }
  }

  // If user is logged in, display a simple welcome screen.
  if (user) {
    return (
      <div style={styles.loggedInContainer}>
        <h2 style={styles.welcomeTitle}>Welcome, {user.email}</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    );
  }

  // If not logged in, display the hero, auth form, benefits, and footer.
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to NewsChat</h1>
        <p style={styles.heroSubtitle}>
          Find the information you are looking for hidden in the news.
        </p>
      </div>

      {/* Authentication Form */}
      <div style={styles.authContainer}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.formButtons}>
          <button onClick={handleSignup} disabled={loading} style={styles.authButton}>
            Sign Up
          </button>
          <button onClick={handleLogin} disabled={loading} style={styles.authButton}>
            Login
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Benefits Section */}
      <div style={styles.benefitsContainer}>
        <div style={styles.benefitCard}>
          <h3 style={styles.benefitTitle}>Original Articles</h3>
          <p style={styles.benefitText}>
            Read the full article.
          </p>
        </div>
        <div style={styles.benefitCard}>
          <h3 style={styles.benefitTitle}>Summarrize</h3>
          <p style={styles.benefitText}>
            Get a summary with the press of a button.
          </p>
        </div>
        <div style={styles.benefitCard}>
          <h3 style={styles.benefitTitle}>Ask Questions</h3>
          <p style={styles.benefitText}>Ask for the details you are looking for.</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} NewsChat.io. All rights reserved.
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #3B82F6, #8B5CF6, #4F46E5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "2rem",
  },
  hero: {
    padding: "3rem 1.5rem",
    maxWidth: "48rem",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  heroSubtitle: {
    fontSize: "1.125rem",
    marginBottom: "2rem",
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    marginTop: "1rem",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "1.5rem",
    borderRadius: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    width: "100%",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "#000"
  },
  formButtons: {
    display: "flex",
    gap: "1rem",
  },
  authButton: {
    flex: 1,
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  error: {
    color: "red",
  },
  benefitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    padding: "3rem 1.5rem",
    maxWidth: "80rem",
    width: "100%",
  },
  benefitCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    borderRadius: "0.5rem",
  },
  benefitTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  benefitText: {
    fontSize: "1rem",
  },
  footer: {
    fontSize: "0.875rem",
    opacity: 0.75,
    marginTop: "2rem",
  },
  loggedInContainer: {
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    marginTop: "1rem",
  },
};
