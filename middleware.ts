import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Match non-root page routes only; avoid unnecessary middleware pass on '/'.
  matcher: ['/((?!$|api|_next/static|_next/image|favicon.ico).+)'],
};
