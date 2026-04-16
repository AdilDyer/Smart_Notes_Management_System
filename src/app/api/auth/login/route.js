import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/validators";
import { setAuthCookie, signAuthToken } from "@/lib/auth";
import { getClientIp, enforceRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin, tooManyRequestsResponse } from "@/lib/security";

export async function POST(request) {
  try {
    const originError = ensureSameOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const rateLimit = enforceRateLimit(`login:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterSeconds);
    }

    const body = await request.json();
    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signAuthToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
