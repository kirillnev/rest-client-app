import { NextRequest, NextResponse } from 'next/server';
import { parseRequest, sendRequest } from '@/utils/requestUtils';

export async function GET(req: NextRequest) {
  const request = parseRequest(req);
  if (!request) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const result = await sendRequest(request);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
