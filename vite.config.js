import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root,
  server: {
    fs: {
      allow: [root],
    },
  },
  build: {
    outDir: resolve(root, 'dist'),
  },
});
