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
    const rateLimit = enforceRateLimit(`register:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterSeconds);
    }

    const body = await request.json();
    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    const token = await signAuthToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
