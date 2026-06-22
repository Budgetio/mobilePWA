import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PWA plugin se zapne až ve fázi 3 (offline + instalace).
// Base './' zajišťuje, že build funguje i z podsložky / statického hostingu.
export default defineConfig({
  base: './',
  plugins: [react()],
})
