'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const articleUrl = searchParams.get('articleUrl'); // expects ?articleUrl=...
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ articleUrl })
        });
        if (!res.ok) {
          throw new Error('Failed to fetch summary');
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
    <div style={{ padding: '1rem' }}>
      <h1>Article Summary</h1>
      {loading ? (
        <p>Loading summary...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>{summary}</p>
      )}
    </div>
  );
}
