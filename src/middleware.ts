// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { StandardResponse } from "./lib/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "3 m"),
  analytics: true,
});

const resetPasswordRatelimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
});

const ALLOWED_ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://re-envision.org";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS" && pathname.startsWith("/api")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (pathname.startsWith("/api/auth/reset")) {
    const rateLimitResponse = await handleRateLimit(
      request,
      resetPasswordRatelimiter,
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response: StandardResponse = {
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: "Internal Server Error",
      data: null,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } else if (pathname.startsWith("/api")) {
    const rateLimitResponse = await handleRateLimit(request, ratelimit);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response: StandardResponse = {
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: "Internal Server Error",
      data: null,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

const handleRateLimit = async (
  request: NextRequest,
  ratelimiter: Ratelimit,
): Promise<NextResponse> => {
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const { success, limit, remaining, reset } = await ratelimiter.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        message: "Too many requests, please try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Retry-After": reset
            ? Math.ceil((reset - Date.now()) / 1000).toString()
            : "60",
        },
      },
    );
  }

  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
};
