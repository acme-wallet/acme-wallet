import { z } from 'zod';

export const ChatStreamSchema = z.object({
    message: z.string(),
    systemPrompt: z.string().optional(),
    model: z.string().optional(),
});

export type ChatStreamInput = z.infer<typeof ChatStreamSchema>;
