import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Vytvoří jeden samostatný HTML soubor (vše inline) — jde otevřít dvojklikem.
// Bez PWA pluginu; service worker se v náhledu neregistruje.
export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
  },
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-standalone', assetsInlineLimit: 100000000 },
})
