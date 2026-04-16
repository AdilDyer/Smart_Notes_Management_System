import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { noteEnhanceSchema } from "@/lib/validators";
import { getGeminiClient } from "@/lib/gemini";
import { getClientIp, enforceRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin, tooManyRequestsResponse } from "@/lib/security";

function getPrompt(content, mode) {
  if (mode === "summary") {
    return `Summarize the following note in 3-5 bullet points. Keep key facts only.\n\nNOTE:\n${content}`;
  }

  return `Improve the clarity, structure, and readability of the following note while preserving intent and factual meaning. Return plain text only.\n\nNOTE:\n${content}`;
}

export async function POST(request) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const originError = ensureSameOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const rateLimit = enforceRateLimit(`ai:${user.userId}:${ip}`, {
      limit: 10,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterSeconds);
    }

    const body = await request.json();
    const parsed = noteEnhanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI payload" }, { status: 400 });
    }

    const client = getGeminiClient();
    const prompt = getPrompt(parsed.data.content, parsed.data.mode);
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = result.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "No response from Gemini" }, { status: 502 });
    }

    return NextResponse.json({
      mode: parsed.data.mode,
      output: text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI enhancement failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
