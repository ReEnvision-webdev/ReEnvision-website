// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple rate limiting store (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api/contact')) {
    const ip = request.ip ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5;

    let requestData = requestCounts.get(ip);
    
    if (!requestData || requestData.resetTime < now) {
      requestData = { count: 0, resetTime: now + windowMs };
    }

    requestData.count += 1;
    requestCounts.set(ip, requestData);

    if (requestData.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ message: 'Too many requests, please try again later' }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }
  }

  // CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
