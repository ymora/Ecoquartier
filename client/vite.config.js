import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA - Application installable
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'images/*.png', 'images/*.jpg'],
      manifest: {
        name: "Les Haies de l'Écocartier de Bessancourt",
        short_name: 'Haies Bessancourt',
        description: 'Guide des arbustes et planificateur de haies champêtres',
        theme_color: '#0a0e1a',
        background_color: '#0a0e1a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    // Compression Brotli pour réduire la taille des bundles JS/CSS
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(jpg|jpeg|png|webp|svg|gif)$/], // Ne pas compresser les images
      threshold: 10240, // Fichiers > 10 KB
      deleteOriginFile: false
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000, // Alerter si chunk > 1 MB
    rollupOptions: {
      output: {
        // Chunking optimisé pour cache navigateur optimal
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
