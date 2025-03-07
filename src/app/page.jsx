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
          content="Discover NewsChat.io, an interactive platform offering AI-powered news summaries, chat-based exploration, and access to original articles."
        />
      </Head>
      <div>
        {/* Navbar (unchanged) */}
        <nav style={styles.navbar}>
          <div style={styles.navbarContent}>
            <span style={styles.navTitle}>NewsChat.io</span>
            <div style={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.01 3.67 9.16 8.47 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99c4.8-.72 8.47-4.87 8.47-9.88 0-5.5-4.46-9.96-9.96-9.96z" fill="#fff" />
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

        {/* Hero Section */}
        <section style={landingStyles.hero}>
          <h1 style={landingStyles.heroTitle}>Welcome to NewsChat.io</h1>
          <p style={landingStyles.heroSubtitle}>
            Your AI-powered companion for smarter news consumption.
          </p>
          <Link href="/news" style={landingStyles.ctaButton}>
            Explore Now
          </Link>
        </section>

        {/* What We Do Section */}
        <section style={landingStyles.whatWeDo}>
          <h2 style={landingStyles.sectionTitle}>What is NewsChat.io?</h2>
          <p style={landingStyles.sectionText}>
            NewsChat.io is an innovative platform designed to revolutionize how you interact with news. Our mission is to make staying informed quick, engaging, and personalized. With NewsChat.io, you get more than just headlines—you get a dynamic newsfeed powered by artificial intelligence that adapts to your preferences and curiosity.
          </p>
          <p style={landingStyles.sectionText}>
            Here’s how it works: browse our curated newsfeed, updated in real-time with stories from trusted sources worldwide. For each article, you have three powerful options. First, request an <strong>AI-generated summary</strong> to get the key points in seconds—perfect for when you’re short on time. Second, engage with our <strong>AI chat feature</strong> to ask questions about the story, from clarifying details to exploring related topics. Third, dive into the <strong>original article</strong> for the full experience, all seamlessly linked within the platform.
          </p>
          <p style={landingStyles.sectionText}>
            Whether you’re a busy professional needing quick updates, a curious reader wanting deeper insights, or someone who loves staying ahead of the news cycle, NewsChat.io has you covered. Our AI technology ensures summaries are concise yet comprehensive, while the chat feature lets you explore news on your terms. Plus, our platform is designed to be intuitive, visually appealing, and accessible across devices, so you can stay informed wherever you are.
          </p>
        </section>

        {/* Features Section */}
        <section style={landingStyles.featuresContainer}>
          <h2 style={landingStyles.sectionTitle}>Why Choose NewsChat.io?</h2>
          <div style={landingStyles.features}>
            <div style={landingStyles.featureCard}>
              <h3 style={landingStyles.featureTitle}>Instant AI Summaries</h3>
              <p style={landingStyles.featureText}>
                Save time with concise, accurate summaries of any article, powered by cutting-edge AI.
              </p>
            </div>
            <div style={landingStyles.featureCard}>
              <h3 style={landingStyles.featureTitle}>Interactive AI Chat</h3>
              <p style={landingStyles.featureText}>
                Ask questions and explore stories deeper with our smart AI companion.
              </p>
            </div>
            <div style={landingStyles.featureCard}>
              <h3 style={landingStyles.featureTitle}>Real-Time Newsfeed</h3>
              <p style={landingStyles.featureText}>
                Stay updated with a curated feed of the latest news from around the globe.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Navbar styles (unchanged)
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
};

// Updated landing page styles
const landingStyles = {
  hero: {
    marginTop: "60px",
    padding: "4rem 2rem",
    background: "linear-gradient(to bottom, #3B82F6, #ffffff)",
    textAlign: "center",
    color: "#fff",
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
    maxWidth: "600px",
  },
  whatWeDo: {
    padding: "3rem 2rem",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1.5rem",
  },
  sectionText: {
    fontSize: "1.1rem",
    color: "#666",
    maxWidth: "800px",
    margin: "0 auto 1rem",
    lineHeight: "1.6",
  },
  featuresContainer: {
    padding: "3rem 2rem",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#3B82F6",
    marginBottom: "0.75rem",
  },
  featureText: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.5",
  },
  ctaButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    backgroundColor: "#8B5CF6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#7C3AED",
    },
  },
};