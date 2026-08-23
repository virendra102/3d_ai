import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  assetsInclude: ['**/*.glb'], // ✅ Tell Vite to treat .glb as a static asset

  resolve: {
    alias: {
      three: 'three' // <-- Force Vite to recognize "three" from node_modules
    }
  },
  optimizeDeps: {
    include: ['three'] // <-- Force Vite to pre-bundle three
  }
})
