import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/field-trips-tracker/",   // ← важливо для GitHub Pages репо-підпапки
});