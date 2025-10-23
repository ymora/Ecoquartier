import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
        manualChunks: {
          // Vendor React (changement rare, cache longue durée)
          'react-vendor': ['react', 'react-dom'],
          
          // Three.js (gros package ~500 KB, séparé pour cache optimal)
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          
          // Fabric.js pour canvas 2D (gros package ~400 KB)
          'fabric-vendor': ['fabric'],
          
          // Icons (changement fréquent, petit)
          'icons': ['react-icons']
        }
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
