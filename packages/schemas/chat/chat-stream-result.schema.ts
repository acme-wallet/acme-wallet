import { z } from 'zod';

export const ChatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text_delta'), delta: z.string() }),
  z.object({ type: z.literal('reasoning_delta'), delta: z.string() }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export const ChatStreamResultSchema = z.object({
  content: z.string(),
  reasoning: z.string(),
  done: z.boolean(),
  error: z.string().nullable(),
});

export type ChatStreamEvent = z.infer<typeof ChatStreamEventSchema>;
export type ChatStreamResult = z.infer<typeof ChatStreamResultSchema>;
