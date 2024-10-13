import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  
  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }
    // Forward request to /api/generate
    const generateResponse = await fetch(`${req.nextUrl.origin}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const generateData = await generateResponse.json();
  return NextResponse.json(generateData, { status: generateResponse.status });

}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed', method: req.method }, { status: 405 });
}