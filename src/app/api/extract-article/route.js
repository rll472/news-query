import { NextResponse } from 'next/server';
import { extractAndStoreArticle } from '@/app/utils/articleExtractor';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function extractAndStoreArticle(url) {
  // Fetch the raw HTML from the URL
  const res = await fetch(url);
  const html = await res.text();

  // Use JSDOM to parse the HTML
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  // Explicitly extract the image URL from meta tags
  let image_url = "";
  const metaOgImage = document.querySelector('meta[property="og:image"]');
  if (metaOgImage) {
    image_url = metaOgImage.getAttribute("content") || "";
  }
  // Fallback: check for a twitter:image tag
  if (!image_url) {
    const metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
    if (metaTwitterImage) {
      image_url = metaTwitterImage.getAttribute("content") || "";
    }
  }

  // Use Readability to extract article content
  const reader = new Readability(document);
  const article = reader.parse();

  // Return an object with all desired fields, including the image_url
  return {
    title: article.title,
    content: article.content,
    byline: article.byline,
    image_url,  // explicitly include the image URL
    lang: article.lang || document.documentElement.lang,
    // add other fields as needed
  };
}
