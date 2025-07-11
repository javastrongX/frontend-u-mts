import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 👉 bu SEO-friendly URL'lar uchun kerak
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': 'http://localhost:5000'
    },
    allowedHosts: 'all'
  },
  preview: {
    port: 8080,
  },
});
