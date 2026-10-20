import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  // на GitHub Pages сайт живёт в подпапке /<имя-репозитория>/ — путь задаёт workflow
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
