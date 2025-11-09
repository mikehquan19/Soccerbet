import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: { 
      '@pages': path.resolve(__dirname, './src/components/pages'),
      '@tables': path.resolve(__dirname, './src/components/tables'),
      '@components': path.resolve(__dirname, './src/components'),
      '@provider': path.resolve(__dirname, './src/provider'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@data': path.resolve(__dirname, './src/data.js'),
    },
  },
})