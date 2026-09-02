import React, { useState, useMemo } from 'react'
import { Card, CardHead, Abas, Status, Vazio } from './ui'
import { money, num, pct, roasFmt } from '../lib/format'
import { canalIcone, canalNome, IcCriativos } from '../icons'

const ORDENS = [
  { valor: 'roas',   rotulo: 'ROAS' },
  { valor: 'receita',rotulo: 'Receita' },
  { valor: 'custo',  rotulo: 'Custo' },
  { valor: 'conv',   rotulo: 'Conversões' },
  { valor: 'ctr',    rotulo: 'CTR' },
]

export default function TabelaCriativos({ criativos, moeda, ecommerce, carregando }) {
  const [ordem, setOrdem]   = useState('roas')
  const [canal, setCanal]   = useState('todos')
  const [soAtivos, setSoAtivos] = useState(true)
  const [aberto, setAberto] = useState(null)

  const canais = useMemo(() => {
    const s = new Set(criativos.map(c => c.canal))
    return ['todos', ...Array.from(s)]
  }, [criativos])

  const lista = useMemo(() => {
    let l = [...criativos]
    if (canal !== 'todos') l = l.filter(c => c.canal === canal)
    if (soAtivos) l = l.filter(c => c.ativo)
    const conv = c => c.compras + c.wpp + c.leads
    const roas = c => (c.custo > 0 && c.receita > 0 ? c.receita / c.custo : 0)
    const cmp = {
      roas:    (a, b) => roas(b) - roas(a),
      receita: (a, b) => b.receita - a.receita,
      custo:   (a, b) => b.custo - a.custo,
      conv:    (a, b) => conv(b) - conv(a),
      ctr:     (a, b) => b.ctr - a.ctr,
    }
    return l.sort(cmp[ordem])
  }, [criativos, ordem, canal, soAtivos])

  if (carregando) {
    return (
      <Card pad={false}>
        <CardHead titulo="Criativos ativos" sub="Carregando…" />
        <div className="p-5 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      </Card>
    )
  }

  if (!criativos.length) {
    return <Vazio icone={IcCriativos} titulo="Nenhum criativo no período"
      descricao="Não há anúncios com investimento registrado para as datas selecionadas." />
  }

  return (
    <>
      <Card pad={false}>
        <CardHead
          titulo="Criativos ativos"
          sub={`${lista.length} anúncios · ordenados por ${ORDENS.find(o => o.valor === ordem)?.rotulo}`}
          direita={
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={soAtivos} onChange={e => setSoAtivos(e.target.checked)}
                  className="w-[13px] h-[13px] rounded accent-[#E50914] cursor-pointer" />
                <span className="text-[11px] text-[var(--tx-card2)]">Somente ativos</span>
              </label>
              {canais.length > 2 && (
                <Abas itens={canais.map(c => ({ valor: c, rotulo: c === 'todos' ? 'Todos' : canalNome(c) }))}
                  ativo={canal} onChange={setCanal} />
              )}
              <Abas itens={ORDENS} ativo={ordem} onChange={setOrdem} />
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-[var(--card-alt)]">
                <Th w="42%">Anúncio</Th>
                <Th right>Custo</Th>
                <Th right>{ecommerce ? 'Conversões' : 'Leads / WPP'}</Th>
                {ecommerce && <Th right>Receita</Th>}
                {ecommerce && <Th right>ROAS</Th>}
                <Th right>CPA</Th>
                <Th right>CTR</Th>
                <Th right>Status</Th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c, i) => {
                const conv = ecommerce ? c.compras : c.leads + c.wpp
                const roas = c.custo > 0 && c.receita > 0 ? c.receita / c.custo : 0
                const cpa  = conv > 0 ? c.custo / conv : 0
                const Ic   = canalIcone(c.canal)
                const corRoas = roas >= 3 ? 'var(--green)' : roas >= 1 ? 'var(--amber)' : 'var(--red)'
                return (
                  <tr key={i} onClick={() => setAberto(c)}
                    className="border-b border-[var(--card-line)] last:border-0 hover:bg-[var(--card-alt)] cursor-pointer transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* miniatura com lazy loading */}
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-[var(--card-alt)] shrink-0 border border-[var(--card-line)]">
                          {c.img
                            ? <img src={c.img} alt="" loading="lazy" decoding="async"
                                className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
                            : <div className="w-full h-full flex items-center justify-center text-[var(--tx-card3)]"><IcCriativos size={15} /></div>}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--tx-card)] truncate max-w-[280px]" title={c.nome}>{c.nome}</div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[var(--tx-card3)]">
                            <span style={{ color: 'var(--red)' }}><Ic size={11} /></span>
                            <span className="text-[10px] truncate max-w-[220px]">{c.campanha || canalNome(c.canal)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <Td right>{money(c.custo, moeda)}</Td>
                    <Td right forte>{num(conv)}</Td>
                    {ecommerce && <Td right cor="var(--green)">{c.receita > 0 ? money(c.receita, moeda) : '—'}</Td>}
                    {ecommerce && <Td right forte cor={roas > 0 ? corRoas : undefined}>{roas > 0 ? roasFmt(roas) : '—'}</Td>}
                    <Td right>{cpa > 0 ? money(cpa, moeda) : '—'}</Td>
                    <Td right>{pct(c.ctr)}</Td>
                    <td className="px-4 py-3 text-right"><Status ativo={c.ativo} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {aberto && <Modal criativo={aberto} moeda={moeda} ecommerce={ecommerce} onFechar={() => setAberto(null)} />}
    </>
  )
}

const Th = ({ children, right, w }) => (
  <th style={{ width: w }}
    className={`${right ? 'text-right' : 'text-left'} px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.07em] text-[var(--tx-card3)] border-b border-[var(--card-line)] whitespace-nowrap`}>
    {children}
  </th>
)

const Td = ({ children, right, forte, cor }) => (
  <td className={`px-4 py-3 tabular-nums whitespace-nowrap ${right ? 'text-right' : ''} ${forte ? 'font-bold' : ''}`}
    style={{ color: cor || 'var(--tx-card2)' }}>
    {children}
  </td>
)

/* ── MODAL DE DETALHE ─────────────────────────────── */
function Modal({ criativo: c, moeda, ecommerce, onFechar }) {
  const conv = ecommerce ? c.compras : c.leads + c.wpp
  const roas = c.custo > 0 && c.receita > 0 ? c.receita / c.custo : 0
  const cpa  = conv > 0 ? c.custo / conv : 0
  const Ic   = canalIcone(c.canal)

  const metricas = ecommerce
    ? [
        ['Custo', money(c.custo, moeda)], ['Receita', money(c.receita, moeda)],
        ['Compras', num(c.compras)], ['ROAS', roas > 0 ? roasFmt(roas) : '—'],
        ['CPA', cpa > 0 ? money(cpa, moeda) : '—'], ['CTR', pct(c.ctr)],
        ['Cliques', num(c.cliques)], ['Impressões', num(c.impressoes)],
        ['Mensagens', num(c.wpp)],
      ]
    : [
        ['Custo', money(c.custo, moeda)], ['Leads', num(c.leads)],
        ['Mensagens', num(c.wpp)], ['CPL', cpa > 0 ? money(cpa, moeda) : '—'],
        ['CTR', pct(c.ctr)], ['Cliques', num(c.cliques)],
        ['Impressões', num(c.impressoes)],
      ]

  return (
    <div onClick={onFechar}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div onClick={e => e.stopPropagation()}
        className="snow max-w-[460px] w-full max-h-[88vh] overflow-y-auto">
        <div className="relative">
          {c.img
            ? <img src={c.img} alt={c.nome} className="w-full aspect-square object-cover rounded-t-2xl" />
            : <div className="w-full h-44 bg-[var(--card-alt)] rounded-t-2xl flex items-center justify-center text-[var(--tx-card3)]"><IcCriativos size={30} /></div>}
          <button onClick={onFechar}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-[var(--red)] transition-colors">×</button>
        </div>
        <div className="p-5">
          <h4 className="text-[15px] font-bold text-[var(--tx-card)] leading-snug">{c.nome}</h4>
          <div className="flex items-center gap-2 mt-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md bg-[var(--card-alt)] text-[var(--tx-card2)]">
              <span style={{ color: 'var(--red)' }}><Ic size={11} /></span>{canalNome(c.canal)}
            </span>
            <Status ativo={c.ativo} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {metricas.map(([r, v]) => (
              <div key={r} className="bg-[var(--card-alt)] rounded-xl p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--tx-card3)] mb-1">{r}</div>
                <div className="text-[15px] font-bold text-[var(--tx-card)] tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
