import { NextResponse } from 'next/server';
import { extractArticle } from '@/app/utils/articleExtractor';

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL missing" }, { status: 400 });

    const article = await extractArticle(url);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error in extract-article route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}