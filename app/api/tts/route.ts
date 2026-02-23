import { NextRequest, NextResponse } from 'next/server';

// Proxy Google Translate TTS — returns Arabic MP3 audio
// No API key required. Requires internet connection.
export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text');

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  // Google TTS has a ~200 char limit per request — trim if needed
  const trimmed = text.slice(0, 200);

  const ttsUrl =
    `https://translate.google.com/translate_tts` +
    `?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Google TTS unavailable' },
        { status: 503 }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // cache 24 hours
      },
    });
  } catch (err) {
    console.error('[TTS] Fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch audio' },
      { status: 503 }
    );
  }
}
