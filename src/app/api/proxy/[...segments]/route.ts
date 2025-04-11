import { NextRequest, NextResponse } from 'next/server';
import { decodeBase64 } from '@/utils/base64';

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/').slice(3);
  const [method, encodedUrl, encodedBody = ''] = segments;
  const url = decodeBase64(encodedUrl);
  const body = decodeBase64(encodedBody);

  const headers: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    headers[key] = decodeURIComponent(value);
  });

  await new Promise((res) => setTimeout(res, 500));

  return NextResponse.json({
    mocked: true,
    method,
    url,
    body,
    headers,
    timestamp: Date.now(),
  });
}
