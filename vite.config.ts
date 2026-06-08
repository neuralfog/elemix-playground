import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        exclude: ['esbuild-wasm'],
    },
    server: {
        port: 5174,
    },
    worker: {
        format: 'es',
    },
});
