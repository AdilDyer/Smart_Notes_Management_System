import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { noteCreateSchema } from "@/lib/validators";
import { ensureSameOrigin } from "@/lib/security";

export async function GET() {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { userId: user.userId },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ notes });
}

export async function POST(request) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const originError = ensureSameOrigin(request);
  if (originError) return originError;

  const body = await request.json();
  const parsed = noteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note payload" }, { status: 400 });
  }

  const title = parsed.data.title ?? "";
  const content = parsed.data.content ?? "";
  const tags = Array.from(new Set((parsed.data.tags ?? []).filter(Boolean)));

  if (!title.trim() && !content.trim()) {
    return NextResponse.json({ error: "Title or content is required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      userId: user.userId,
      title,
      content,
      tags,
    },
  });

  return NextResponse.json({ note }, { status: 201 });
}
