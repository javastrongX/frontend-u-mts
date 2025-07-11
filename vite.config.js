// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     strictPort: true,
//     cors: true,
//     hmr: {
//       clientPort: 443,
//       protocol: 'wss',
//       host: 'df28-84-54-73-64.ngrok-free.app'
//     },
//     proxy: {
//       '/api': 'http://localhost:5000'
//     },
//     allowedHosts: 'all'
//   },
//   preview: {
//     port: 8080,
//   },
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // Har qanday IP orqali kirishga ruxsat
    port: 5173,            // Fikslangan port
    strictPort: true,      // Port band bo‘lsa, boshqa portga o‘tmasin
    cors: true,            // Boshqa domenlardan kelgan so‘rovlar uchun
    proxy: {
      '/api': 'http://localhost:5000' // Backend API (agar kerak bo‘lsa)
    },
    allowedHosts: 'all'    // Telefon/NGROK orqali kirish uchun
  },
  preview: {
    port: 8080,
  },
});
