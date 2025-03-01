// src/app/components/TransitionAd.jsx
"use client";

import { useState, useEffect } from 'react';

export default function TransitionAd({ onComplete }) {
  const [canSkip, setCanSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const skipTimer = setTimeout(() => setCanSkip(true), 2000);

    // Push AdSense ad when component mounts
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("Error loading AdSense ad:", err);
      }
    }

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#fff',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* AdSense ad */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
        crossorigin="anonymous"></script>
      <p>Ad ends in {timeLeft} seconds</p>
      {canSkip && (
        <button onClick={onComplete} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Skip Ad
        </button>
      )}
    </div>
  );
}