/**
 * Proxy para a API da Anthropic (resumo do período por IA).
 *
 * A chave NUNCA vai para o navegador: fica em ANTHROPIC_API_KEY
 * nas variáveis de ambiente do Vercel.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Use POST' })
  }

  const chave = process.env.ANTHROPIC_API_KEY
  if (!chave) {
    return res.status(200).json({
      texto: 'Resumo por IA não configurado. Adicione a variável ANTHROPIC_API_KEY nas configurações do projeto no Vercel.',
    })
  }

  try {
    const { prompt } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    if (!prompt) return res.status(400).json({ erro: 'prompt obrigatório' })

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const j = await r.json()
    const texto = (j.content || [])
      .filter(i => i.type === 'text')
      .map(i => i.text)
      .join('\n')
      .trim()

    return res.status(200).json({ texto: texto || 'Não foi possível gerar o resumo agora.' })
  } catch (e) {
    console.error('[api/ai]', e.message)
    return res.status(200).json({ texto: 'Não foi possível gerar o resumo agora.' })
  }
}
