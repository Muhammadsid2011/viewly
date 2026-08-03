import { z } from "zod";
import mongoose from "mongoose";

export const createCommentSchema = z.object({
    content: z
      .string()
      .trim()
      .min(1, "Content is required")
      .max(1000, "Content cannot exceed 1000 characters"),

    video: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid video ObjectId",
      }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;