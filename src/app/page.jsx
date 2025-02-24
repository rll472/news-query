"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if the user is already logged in when the page loads,
  // and also subscribe to auth state changes for redirection.
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.push("/stories-db");
        }
      }
    );    

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, [router]);

  // Handle user signup
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
      // Redirection will occur via the auth state change listener.
    }
    setLoading(false);
  }

  // Handle user login
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
      // Redirection will occur via the auth state change listener.
    }
    setLoading(false);
  }

  // Handle user logout
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div style={styles.container}>
      <h1>Welcome to the Newsfeed</h1>
      {!user ? (
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
          <button onClick={handleSignup} disabled={loading} style={styles.button}>
            Sign Up
          </button>
          <button onClick={handleLogin} disabled={loading} style={styles.button}>
            Login
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      ) : (
        <div style={styles.userInfo}>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    marginTop: "1rem",
  },
  input: {
    padding: "0.5rem",
    width: "250px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    marginTop: "1rem",
  },
  error: {
    color: "red",
  },
  userInfo: {
    marginTop: "1rem",
  },
};
