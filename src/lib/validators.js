import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const noteCreateSchema = z.object({
  title: z.string().trim().max(200).optional().default(""),
  content: z.string().trim().max(10000).optional().default(""),
  tags: z.array(z.string().trim().toLowerCase()).max(30).optional().default([]),
});

export const noteUpdateSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().max(10000).optional(),
  tags: z.array(z.string().trim().toLowerCase()).max(30).optional(),
  isPinned: z.boolean().optional(),
  aiSummary: z.string().trim().max(4000).nullable().optional(),
  aiEnhancedText: z.string().trim().max(12000).nullable().optional(),
});

export const noteEnhanceSchema = z.object({
  content: z.string().trim().min(1).max(10000),
  mode: z.enum(["summary", "enhance"]),
});
