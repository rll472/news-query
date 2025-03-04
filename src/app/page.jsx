// src/app/page.jsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
          crossOrigin="anonymous"
        ></script>
        <title>NewsChat.io - Your AI-Powered News Companion</title>
        <meta
          name="description"
          content="Discover NewsChat.io, an interactive platform offering AI-powered news summaries and chats."
        />
      </Head>
      <div>
        <nav style={styles.navbar}>
          <div style={styles.navbarContent}>
            <span style={styles.navTitle}>NewsChat.io</span>
            <div style={styles.socialLinks}>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="#fff"
                  />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.01 3.67 9.16 8.47 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99c4.8-.72 8.47-4.87 8.47-9.88 0-5.5-4.46-9.96-9.96-9.96z"
                    fill="#fff"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.536-11.464a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.536 1.464c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
                    fill="#fff"
                  />
                </svg>
              </a>
            </div>
          </div>
        </nav>
        <div style={landingStyles.container}>
          <h1 style={landingStyles.title}>Welcome to NewsChat.io</h1>
          <p style={landingStyles.subtitle}>
            Experience news like never before with our interactive AI-powered
            platform.
          </p>
          <div style={landingStyles.features}>
            <div style={landingStyles.featureCard}>
              <h2 style={landingStyles.featureTitle}>Instant AI Summaries</h2>
              <p style={landingStyles.featureText}>
                Get quick, accurate summaries of news articles powered by
                advanced AI.
              </p>
            </div>
            <div style={landingStyles.featureCard}>
              <h2 style={landingStyles.featureTitle}>Engage with AI Chat</h2>
              <p style={landingStyles.featureText}>
                Dive deeper into stories with our interactive AI chat feature.
              </p>
            </div>
            <div style={landingStyles.featureCard}>
              <h2 style={landingStyles.featureTitle}>Stay Informed</h2>
              <p style={landingStyles.featureText}>
                Access a curated newsfeed updated in real-time.
              </p>
            </div>
          </div>
          <Link href="/news" style={landingStyles.ctaButton}>
            Start Exploring News
          </Link>
        </div>
      </div>
    </>
  );
}

// Reuse navbar styles from newsfeed
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
};

// Landing page-specific styles
const landingStyles = {
  container: {
    marginTop: "70px",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#666",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    maxWidth: "1000px",
    marginBottom: "2rem",
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  featureTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#0070f3",
  },
  featureText: {
    fontSize: "0.9rem",
    color: "#666",
  },
  ctaButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#8B5CF6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};