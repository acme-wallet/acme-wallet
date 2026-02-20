import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        },
    },
    test: {
        include: ['src/**/*.spec.ts'],
        exclude: ['node_modules', 'dist', '**/*.e2e-spec.ts'],
        globals: true,
        environment: 'node',
    },
    plugins: [swc.vite()],
});