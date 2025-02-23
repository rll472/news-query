import { NextResponse } from 'next/server';
import { extractAndStoreArticle } from '@/app/utils/articleExtractor';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const articleData = await extractAndStoreArticle(url);
    return NextResponse.json({ article: articleData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
