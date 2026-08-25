import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build SPA para deploy no Vercel. As rotas de cliente usam query string (?cliente=slug),
// então não precisamos de history fallback complexo — funciona como página única.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts', 'echarts-for-react'],
          recharts: ['recharts'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
