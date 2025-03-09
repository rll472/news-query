// src/app/not-found.jsx
"use client";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return <div>404 - Page Not Found. Check URL: {window.location.href}</div>;
}