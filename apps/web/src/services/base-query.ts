import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '../common/configs/env';

export const baseQuery = fetchBaseQuery({
  baseUrl: env.VITE_API_URL,
  prepareHeaders: (headers: Headers) => {
    const token = localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
