// Example serverless function for heavy tasks
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Simulate heavy computation
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return NextResponse.json({ status: 'done', timestamp: Date.now() });
}
