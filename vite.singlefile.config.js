import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Vytvoří jeden samostatný HTML soubor (vše inline) — jde otevřít dvojklikem.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-standalone', assetsInlineLimit: 100000000 },
})
