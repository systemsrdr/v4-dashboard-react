import { useState } from 'react'
import { IconSparkles } from '../icons'
import { groupMeta, groupGoogle, cleanCamp } from '../lib/format'

// Resumo executivo por IA do período. Em produção, aponta para /api/ai (proxy que injeta a chave).
export function AiSummary({ client, data, fmt, dateFrom, dateTo }) {
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  const gerar = async () => {
    setBusy(true); setOut('Analisando os dados do período…')
    try {
      const mG = groupMeta(data.meta), gG = groupGoogle(data.google)
      const mSp = mG.reduce((a, x) => a + x.sp, 0), gSp = gG.reduce((a, x) => a + x.sp, 0)
      const wpp = mG.reduce((a, x) => a + (x.wpp || 0), 0), leads = mG.reduce((a, x) => a + (x.leads || 0), 0)
      const pur = data.fin.v || mG.reduce((a, x) => a + (x.pur || 0), 0)
      const rev = data.fin.fat || mG.reduce((a, x) => a + (x.rev || 0), 0)
      const gConv = gG.reduce((a, x) => a + x.conv, 0)
      const p = data.prev
      const top = mG.slice(0, 3).map((d) => `${cleanCamp(d.c)}: gasto ${fmt.fr(d.sp)}, ${d.pur > 0 ? fmt.fn(d.pur) + ' vendas' : fmt.fn((d.wpp || 0) + (d.leads || 0)) + ' result.'}`).join('; ')
      const dados = {
        cliente: client.nome, tipo: client.tipo === 'ec' ? 'e-commerce' : 'inside sales', periodo: `${dateFrom} a ${dateTo}`, moeda: client.moeda,
        investimento_meta: mSp, investimento_google: gSp, whatsapp: wpp, leads, conv_google: Math.round(gConv), vendas: pur, receita: rev,
        periodo_anterior: { gasto_meta: p.mSp, gasto_google: p.gSp, vendas: p.v, receita: p.rev, whatsapp: p.wpp, leads: p.leads },
        top_campanhas: top, fonte_fundo_funil: client.funilSource || 'nenhuma', dados_fonte: data.funilSrc || {},
      }
      const prompt = `Você é analista de tráfego da V4 Company RDR. Escreva um resumo executivo e direto (máx 180 palavras) da performance deste cliente, em português do Brasil, para o gestor enviar ao cliente. Compare com o período anterior quando fizer sentido, aponte 1 destaque positivo, 1 ponto de atenção e 1 recomendação acionável. Não invente números. Use **negrito** apenas nos números-chave.\n\nDADOS:\n${JSON.stringify(dados, null, 2)}`

      // Em produção troque a URL por '/api/ai' (proxy). Aqui usamos o endpoint direto.
      const endpoint = '/api/ai'
      const resp = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
      })
      if (!resp.ok) throw new Error('proxy')
      const j = await resp.json()
      const txt = (j.content || []).filter((i) => i.type === 'text').map((i) => i.text).join('\n').trim()
      setOut(txt || 'Não foi possível gerar o resumo agora.')
    } catch {
      setOut('Não foi possível gerar o resumo. Verifique se o endpoint /api/ai está configurado no Vercel (proxy da API Anthropic).')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-5 mb-6 flex items-start justify-between gap-4 flex-wrap" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex-1 min-w-[240px]">
        <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Resumo do período por IA</div>
        <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-3)' }}>Análise automática · somente este cliente</div>
        {out && (
          <div className="mt-3 text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}
            dangerouslySetInnerHTML={{ __html: out.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') }} />
        )}
      </div>
      <button onClick={gerar} disabled={busy} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-bold text-white shrink-0" style={{ background: busy ? 'var(--text-3)' : 'var(--ink)' }}>
        <IconSparkles width={16} height={16} style={{ color: '#fff' }} />
        {busy ? 'Gerando…' : 'Gerar resumo'}
      </button>
    </div>
  )
}
