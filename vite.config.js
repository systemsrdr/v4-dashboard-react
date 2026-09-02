import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const WINDSOR = 'https://connectors.windsor.ai/all'
const KEY = process.env.WINDSOR_API_KEY || '2d4d1d577551f238260e5e6e150a4d7b4f24'

/**
 * Em produção o Vercel executa api/data.js automaticamente.
 * O servidor de desenvolvimento do Vite não executa /api, então este
 * plugin recria o mesmo proxy localmente — assim `npm run dev` puxa
 * os dados igual à produção.
 */
function proxyWindsorDev() {
  return {
    name: 'proxy-windsor-dev',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res) => {
        try {
          const q = new URL(req.url, 'http://localhost').searchParams
          const params = new URLSearchParams({
            api_key: KEY,
            date_from: q.get('date_from') || '',
            date_to: q.get('date_to') || '',
            fields: q.get('fields') || '',
          })
          if (q.get('breakdowns')) params.set('breakdowns', q.get('breakdowns'))

          const r = await fetch(`${WINDSOR}?${params}`)
          const json = await r.json()
          const data = Array.isArray(json) ? json : (json.data || [])

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ data }))
        } catch (e) {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ data: [], erro: e.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), proxyWindsorDev()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
