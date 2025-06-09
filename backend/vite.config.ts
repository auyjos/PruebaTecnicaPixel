import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'node18',
        lib: {
            entry: 'src/index.ts',
            name: 'CalendarBackend',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: ['express', 'firebase-admin', 'cors', 'helmet', 'express-validator', 'dotenv']
        },
        outDir: 'dist',
        emptyOutDir: true
    },
    esbuild: {
        target: 'node18'
    }
});
