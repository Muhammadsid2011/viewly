import z from "zod";

export const createTweetSchema = z.object({
    content: z.string().min(1, "Content is required")
});

export type CreateTweetInput = z.infer<typeof createTweetSchema>;