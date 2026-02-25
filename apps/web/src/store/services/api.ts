import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateUserInput, CreateUserOutput } from '@repo/schemas';

type User = {
  id: number;
  name: string;
  email: string;
};

export type UpdateUserInput = Partial<Omit<User, 'id'>> & { id: string };

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
