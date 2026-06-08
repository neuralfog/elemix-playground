import { defineConfig } from 'vite';
import { ELEMIX_VERSION } from './src/generated/elemix-meta';

const output = {
    entryFileNames: `assets/[name]-${ELEMIX_VERSION}-[hash].js`,
    chunkFileNames: `assets/[name]-${ELEMIX_VERSION}-[hash].js`,
    assetFileNames: `assets/[name]-${ELEMIX_VERSION}-[hash][extname]`,
};

export default defineConfig({
    optimizeDeps: {
        exclude: ['esbuild-wasm'],
    },
    server: {
        port: 5174,
    },
    worker: {
        format: 'es',
        rollupOptions: { output },
    },
    build: {
        rollupOptions: { output },
    },
});
