import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import cv from './cv-pipeline/vite-plugin-cv.ts'

export default defineConfig({
  plugins: [
    // content/cv.md → `virtual:cv` (CV data, EN + VI). Invalid CV data fails the build.
    cv(),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
