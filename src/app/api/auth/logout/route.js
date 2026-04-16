import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/security";

export async function POST(request) {
  const originError = ensureSameOrigin(request);
  if (originError) return originError;

  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
