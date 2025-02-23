import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { supabase } from '../lib/supabaseClient';

export async function extractAndStoreArticle(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    console.log("Extracted article:", article);

    if (!article) {
      throw new Error('Article parsing failed.');
    }

    // Destructure and attempt to use textContent first
    const { title, content, textContent } = article;
    let extractedContent = textContent || content || "";

    // If HTML content is required but it only contains a container, remove it.
    if (extractedContent && extractedContent.startsWith('<div id="readability-page-1"')) {
      const tempDom = new JSDOM(extractedContent);
      const wrapper = tempDom.window.document.querySelector('#readability-page-1');
      if (wrapper) {
        extractedContent = wrapper.innerHTML;
      }
    }

    const source = new URL(url).hostname;
    const published_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('articles')
      .insert([{ url, title, source, published_at, content: extractedContent }]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error extracting or storing article:', error);
    throw error;
  }
}
