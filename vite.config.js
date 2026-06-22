import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base './' zajišťuje, že build funguje i z podsložky / statického hostingu.
export default defineConfig({
  base: './',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' = novou verzi aplikujeme až po potvrzení uživatelem (tlačítko v appce).
      registerType: 'prompt',
      injectRegister: false, // registraci řešíme sami v src/lib/pwa.js
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'BUDGETO',
        short_name: 'BUDGETO',
        description: 'Sledování rozpočtu – lokální data, bez backendu.',
        lang: 'cs',
        theme_color: '#E6E22A',
        background_color: '#F1F2F5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
