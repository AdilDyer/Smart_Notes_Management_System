import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { noteUpdateSchema } from "@/lib/validators";
import { ensureSameOrigin } from "@/lib/security";

export async function PATCH(request, { params }) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const originError = ensureSameOrigin(request);
  if (originError) return originError;

  const { id } = params;
  const body = await request.json();
  const parsed = noteUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note payload" }, { status: 400 });
  }

  const existing = await prisma.note.findFirst({
    where: { id, userId: user.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const note = await prisma.note.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ note });
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const originError = ensureSameOrigin(request);
  if (originError) return originError;

  const { id } = params;
  const existing = await prisma.note.findFirst({
    where: { id, userId: user.userId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
