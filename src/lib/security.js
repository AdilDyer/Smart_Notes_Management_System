import { NextResponse } from "next/server";

export function ensureSameOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  return null;
}

export function tooManyRequestsResponse(retryAfterSeconds = 60) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
