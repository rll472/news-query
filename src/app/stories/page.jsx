// app/stories/page.jsx
import React from 'react';

export default async function Stories() {
  const apiKey = process.env.NEWSAPI_API_KEY;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
  );
  const data = await res.json();
  const articles = data.articles || [];

  return (
    <div style={styles.container}>
      {articles.map((article) => (
        <div key={article.url} style={styles.card}>
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              style={styles.thumbnail}
            />
          )}
          <div style={styles.content}>
            <h2 style={styles.title}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {article.title}
              </a>
            </h2>
            <p style={styles.description}>{article.description}</p>
            <small style={styles.meta}>
              {new Date(article.publishedAt).toLocaleString()} -{' '}
              {article.source.name}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    overflowY: 'scroll',
    padding: '0.5rem',
    backgroundColor: '#f9f9f9',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  thumbnail: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '0.5rem',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1rem',
    margin: '0.2rem 0',
  },
  link: {
    color: '#000', // Black text color
    textDecoration: 'none',
  },
  description: {
    fontSize: '0.8rem',
    margin: '0.2rem 0',
  },
  meta: {
    fontSize: '0.7rem',
    color: '#666',
  },
};
