// src/app/stories-db/page.jsx
import StoriesClient from "../components/StoriesClient";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

export default function StoriesDBPage() {
  return <StoriesClient />;
}