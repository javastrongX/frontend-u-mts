import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // 👉 bu SEO-friendly URL'lar uchun kerak
  plugins: [react(), tailwindcss(),],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://backend-u-mts.onrender.com',
        changeOrigin: true,
        secure: true
      }
    },
    allowedHosts: 'all'
  },
  preview: {
    port: 8080,
  },
});
