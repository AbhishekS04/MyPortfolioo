import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('file_id');
    const type = searchParams.get('type');

    if (!fileId) {
      return new NextResponse('Missing file_id', { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      return new NextResponse('Server Configuration Error', { status: 500 });
    }

    // Step 1: Get the file_path from Telegram using the file_id
    const fileRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`,
    );
    const fileData = await fileRes.json();

    if (!fileData.ok || !fileData.result?.file_path) {
      return new NextResponse('File not found on Telegram', { status: 404 });
    }

    const filePath = fileData.result.file_path;

    // Step 2: Fetch the actual file from Telegram
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const mediaRes = await fetch(downloadUrl);

    if (!mediaRes.ok) {
      return new NextResponse('Failed to download media', { status: 502 });
    }

    // Pass along the content-type and stream it to the client
    const contentType =
      mediaRes.headers.get('content-type') ||
      (type === 'video' ? 'video/mp4' : 'image/jpeg');

    // We use a robust Cache-Control header so Vercel caches this file on the edge
    // This prevents us from hitting Telegram API limits when multiple users view the story
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set(
      'Cache-Control',
      'public, max-age=31536000, s-maxage=31536000, immutable',
    );

    return new NextResponse(mediaRes.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Telegram Media Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
