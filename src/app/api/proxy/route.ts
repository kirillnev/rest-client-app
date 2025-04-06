import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log('Proxy received:', data);

  await new Promise((res) => setTimeout(res, 1000));

  return NextResponse.json({
    message: 'Mocked response from server',
    received: data,
    timestamp: Date.now(),
  });
}
