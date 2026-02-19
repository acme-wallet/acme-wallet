import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:3000/api-json',
    },

    output: {
      client: 'redux-query',
      target: './src/services/api.ts',
      schemas: './src/services/model',
      mode: 'tags',
      clean: true,
      prettier: true,

      override: {
        mutator: {
          path: './src/services/baseQuery.ts',
          name: 'baseQuery',
        },
      },
    },
  },
});
