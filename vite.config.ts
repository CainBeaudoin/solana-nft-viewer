import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'node-polyfills',
          resolveId(id) {
            if (id === 'stream') return 'stream-browserify';
            if (id === 'http') return { id: 'stream-http', external: false };
            if (id === 'https') return { id: 'https-browserify', external: false };
            if (id === 'zlib') return { id: 'browserify-zlib', external: false };
            if (id === 'url') return { id: 'url/', external: false };
            if (id === 'assert') return { id: 'assert/', external: false };
            return null;
          },
        },
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
