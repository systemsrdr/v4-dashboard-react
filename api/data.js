/**
 * Proxy para a Windsor.ai.
 *
 * O navegador NÃO pode chamar connectors.windsor.ai direto: a Windsor não
 * envia cabeçalhos CORS, então o fetch é bloqueado e volta vazio.
 * Esta função roda no servidor (Vercel), faz a chamada e devolve o JSON.
 *
 * Uso no front:
 *   fetch('/api/data?date_from=2026-01-01&date_to=2026-01-31&fields=source,spend')
 */
const WINDSOR_BASE = 'https://connectors.windsor.ai/all'
const FALLBACK_KEY = '2d4d1d577551f238260e5e6e150a4d7b4f24'

export default async function handler(req, res) {
  const apiKey = process.env.WINDSOR_API_KEY || FALLBACK_KEY

  const { date_from, date_to, fields, breakdowns } = req.query || {}

  if (!date_from || !date_to || !fields) {
    return res.status(400).json({
      error: 'Parâmetros obrigatórios: date_from, date_to, fields',
      data: [],
    })
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    date_from,
    date_to,
    fields,
  })
  if (breakdowns) params.set('breakdowns', breakdowns)

  const url = `${WINDSOR_BASE}?${params}`

  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!r.ok) {
      const texto = await r.text().catch(() => '')
      console.error('[api/data] Windsor respondeu', r.status, texto.slice(0, 300))
      return res.status(200).json({ data: [], erro: `Windsor HTTP ${r.status}` })
    }

    const json = await r.json()
    const data = Array.isArray(json) ? json : (json.data || [])

    // Cache na borda do Vercel: 5 min fresco, 15 min revalidando
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    return res.status(200).json({ data })
  } catch (e) {
    console.error('[api/data] falha:', e.message)
    return res.status(200).json({ data: [], erro: e.message })
  }
}
