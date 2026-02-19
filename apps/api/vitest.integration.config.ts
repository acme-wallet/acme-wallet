
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
        include: ['test/**/*.integration.spec.ts'],
        globals: true,
        environment: 'node',
        testTimeout: 60_000,
        hookTimeout: 60_000,
        globalSetup: './test/global-setup.ts',
        fileParallelism: false,
    },
    plugins: [swc.vite()],
});