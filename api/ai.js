// Proxy serverless para a API da Anthropic (usado pelo "Resumo por IA").
// A chave fica só no servidor (env ANTHROPIC_API_KEY).
// POST /api/ai  body: { model, max_tokens, messages }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  const KEY = process.env.ANTHROPIC_API_KEY
  if (!KEY) return res.status(500).json({ error: 'missing_ANTHROPIC_API_KEY' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-6',
        max_tokens: body.max_tokens || 1000,
        messages: body.messages || [],
      }),
    })
    const text = await r.text()
    res.setHeader('Content-Type', 'application/json')
    return res.status(r.status).send(text)
  } catch (e) {
    return res.status(502).json({ error: 'upstream_failed', detail: String(e) })
  }
}
