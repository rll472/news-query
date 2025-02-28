import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function extractArticle(url) { // Renamed to avoid conflict
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) throw new Error(`Failed to fetch article: ${res.statusText}`);
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;
    const reader = new Readability(document);
    const article = reader.parse();

    if (!article) throw new Error('Article parsing failed.');

    const { title, content, textContent, byline } = article;
    let extractedContent = textContent || content || "";
    if (extractedContent && extractedContent.startsWith('<div id="readability-page-1"')) {
      const tempDom = new JSDOM(extractedContent);
      const wrapper = tempDom.window.document.querySelector('#readability-page-1');
      if (wrapper) extractedContent = wrapper.innerHTML;
    }

    // Extract image_url from meta tags
    let image_url = "";
    const metaOgImage = document.querySelector('meta[property="og:image"]');
    if (metaOgImage) image_url = metaOgImage.getAttribute("content") || "";
    if (!image_url) {
      const metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
      if (metaTwitterImage) image_url = metaTwitterImage.getAttribute("content") || "";
    }

    return {
      title,
      content: extractedContent,
      byline,
      image_url,
      lang: article.lang || document.documentElement.lang
    };
  } catch (error) {
    console.error('Error extracting article:', error);
    throw error;
  }
}