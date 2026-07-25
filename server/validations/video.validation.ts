import { z } from "zod";

export const createVideoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100),

  isPublished: z.boolean().optional().default(true),
});

export type CreateVideoSchema = z.infer<typeof createVideoSchema>;