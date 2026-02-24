import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ChatStreamInput,
  CreateUserInput,
  CreateUserOutput,
} from '@repo/schemas';

type User = {
  id: number;
  name: string;
  email: string;
};

export type UpdateUserInput = Partial<Omit<User, 'id'>> & { id: string };

export type StreamEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'reasoning_delta'; delta: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export type ChatStreamResult = {
  content: string;
  reasoning: string;
  done: boolean;
  error: string | null;
};

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: 'Users' as const, id: u.id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_user: unknown, _err: unknown, id: string) => [
        { type: 'Users', id },
      ],
    }),

    createUser: builder.mutation<CreateUserOutput, CreateUserInput>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<User, UpdateUserInput>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (
        _user: unknown,
        _err: unknown,
        arg: UpdateUserInput,
      ) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res: unknown, _err: unknown, id: number) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    streamChat: builder.query<ChatStreamResult, ChatStreamInput>({
      queryFn: () => ({
        data: { content: '', reasoning: '', done: false, error: null },
      }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
        const controller = new AbortController();

        try {
          const response = await fetch(`${baseUrl}/chat/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arg),
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            updateCachedData((draft) => {
              draft.error = `HTTP error: ${response.status}`;
              draft.done = true;
            });
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const raw = line.slice(6).trim();
              if (!raw) continue;

              let event: StreamEvent;
              try {
                event = JSON.parse(raw) as StreamEvent;
              } catch {
                continue;
              }

              updateCachedData((draft) => {
                if (event.type === 'text_delta') {
                  draft.content += event.delta;
                } else if (event.type === 'reasoning_delta') {
                  draft.reasoning += event.delta;
                } else if (event.type === 'error') {
                  draft.error = event.message;
                  draft.done = true;
                } else if (event.type === 'done') {
                  draft.done = true;
                }
              });

              if (event.type === 'done' || event.type === 'error') break;
            }
          }
        } catch {
          updateCachedData((draft) => {
            draft.error =
              'Falha ao conectar ao servidor. Verifique se a API está rodando.';
            draft.done = true;
          });
        }

        await cacheEntryRemoved;
        controller.abort();
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useLazyStreamChatQuery,
} = api;
