// Proxy de diagnóstico: lista as contas conectadas na Windsor.ai.
// GET /api/accounts        → contas
// GET /api/accounts?debug=1 → resposta bruta para depuração
export default async function handler(req, res) {
  const KEY = process.env.WINDSOR_API_KEY || '2d4d1d577551f238260e5e6e150a4d7b4f24'
  const debug = req.query && req.query.debug

  const endpoints = [
    `https://connectors.windsor.ai/connectors?api_key=${KEY}`,
    `https://connectors.windsor.ai/accounts?api_key=${KEY}`,
  ]

  for (const url of endpoints) {
    try {
      const r = await fetch(url)
      const text = await r.text()
      if (r.ok) {
        res.setHeader('Content-Type', 'application/json')
        if (debug) return res.status(200).json({ source: url, raw: text })
        return res.status(200).send(text)
      }
    } catch {
      /* tenta o próximo */
    }
  }
  return res.status(502).json({ error: 'no_endpoint_available' })
}
