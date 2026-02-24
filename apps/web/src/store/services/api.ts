import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateUserInput, CreateUserOutput } from '@repo/schemas';

type User = {
  id: number;
  name: string;
  email: string;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<CreateUserOutput, CreateUserInput>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = api;
