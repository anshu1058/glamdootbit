import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path-browserify';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      'path': 'path-browserify'
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  define: {
    'process.env': process.env
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // external: ['source-map-js'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // proxy: {
    //   '/api': {
    //     target: 'https://bankbot-back-win.azurewebsites.net',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  }
});
