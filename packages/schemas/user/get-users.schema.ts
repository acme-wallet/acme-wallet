import { z } from "zod";

export const GetUsersSchema = z.object({
    id: z.uuid().optional().describe('Filter by id'),
    name: z.string().min(3).optional().describe('Filter by name'),
    email: z.email().optional().describe('Filter by email'),
});

export const GetUsersResponseSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3),
    email: z.email(),
});

export type GetUsersInput = z.infer<typeof GetUsersSchema>;
export type GetUsersOutput = z.infer<typeof GetUsersResponseSchema>;
