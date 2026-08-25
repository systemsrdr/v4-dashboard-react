// Proxy serverless para a API da Windsor.ai.
// GET /api/data?date_from=&date_to=&fields=  → encaminha para connectors.windsor.ai/all
// A chave fica só no servidor (env WINDSOR_API_KEY), nunca no front.
export default async function handler(req, res) {
  const KEY = process.env.WINDSOR_API_KEY || '2d4d1d577551f238260e5e6e150a4d7b4f24'
  const { date_from, date_to, fields, breakdowns } = req.query || {}

  const params = new URLSearchParams()
  params.set('api_key', KEY)
  params.set('date_preset', 'custom')
  if (date_from) params.set('date_from', date_from)
  if (date_to) params.set('date_to', date_to)
  if (fields) params.set('fields', fields)
  if (breakdowns) params.set('breakdowns', breakdowns)
  params.set('_renderer', 'json')

  const url = `https://connectors.windsor.ai/all?${params.toString()}`
  try {
    const r = await fetch(url)
    const text = await r.text()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(r.status).send(text)
  } catch (e) {
    return res.status(502).json({ error: 'upstream_failed', detail: String(e), data: [] })
  }
}
