import React, { useState, useMemo } from 'react'
import { Card, CardHead, Vazio } from './ui'
import { money, num, pct, roasFmt } from '../lib/format'
import { IcCriativos, canalIcone } from '../icons'

const ORDENS = [
  { valor: 'result',  rotulo: 'Result.' },
  { valor: 'receita', rotulo: 'Receita' },
  { valor: 'custo',   rotulo: 'Custo' },
  { valor: 'ctr',     rotulo: 'CTR' },
]

/* Galeria "Anúncios Campeões" — mesmos dados de buscarCriativos() */
export default function CriativosCampeoes({ criativos, moeda, ecommerce, carregando }) {
  const [ordem, setOrdem] = useState('result')
  const [soAtivos, setSoAtivos] = useState(true)

  const result = c => (c.compras || 0) + (c.wpp || 0) + (c.leads || 0)

  const lista = useMemo(() => {
    let l = [...criativos]
    if (soAtivos) l = l.filter(c => c.ativo)
    const cmp = {
      result:  (a, b) => result(b) - result(a),
      receita: (a, b) => b.receita - a.receita,
      custo:   (a, b) => b.custo - a.custo,
      ctr:     (a, b) => b.ctr - a.ctr,
    }
    return l.sort(cmp[ordem])
  }, [criativos, ordem, soAtivos])

  if (carregando) {
    return (
      <Card pad={false}>
        <CardHead titulo="Anúncios campeões" sub="Carregando…" />
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      </Card>
    )
  }

  if (!criativos.length) {
    return <Vazio icone={IcCriativos} titulo="Nenhum criativo no período"
      descricao="Não há anúncios com investimento registrado para as datas selecionadas." />
  }

  return (
    <Card pad={false}>
      <CardHead
        titulo="Anúncios campeões"
        sub={`${lista.length} anúncios · ordenado por ${ORDENS.find(o => o.valor === ordem).rotulo}`}
        direita={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={soAtivos} onChange={e => setSoAtivos(e.target.checked)}
                className="w-[14px] h-[14px] rounded accent-[var(--red)] cursor-pointer" />
              <span className="text-[11px] text-[var(--tx-card2)]">Somente ativos</span>
            </label>
            <div className="flex gap-1">
              {ORDENS.map(o => (
                <button key={o.valor} onClick={() => setOrdem(o.valor)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                    ordem === o.valor
                      ? 'bg-[var(--red)] text-white'
                      : 'text-[var(--tx-card2)] hover:bg-[var(--card-alt)]'}`}>
                  {o.rotulo}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {lista.map((c, i) => (
          <CardCriativo key={(c.id || c.nome) + i} c={c} rank={i + 1} moeda={moeda} ecommerce={ecommerce} result={result(c)} />
        ))}
      </div>
    </Card>
  )
}

function CardCriativo({ c, rank, moeda, ecommerce, result }) {
  const [erroImg, setErroImg] = useState(false)
  const Icone = canalIcone(c.canal)
  const top = rank === 1

  return (
    <div className="rounded-2xl overflow-hidden border transition hover:shadow-lg"
      style={{ borderColor: top ? 'var(--red)' : 'var(--card-line)', background: 'var(--card)' }}>

      {/* thumbnail */}
      <div className="relative aspect-[4/3] bg-[var(--card-alt)] overflow-hidden">
        {c.img && !erroImg ? (
          <img src={c.img} alt={c.nome} loading="lazy" onError={() => setErroImg(true)}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-[var(--tx-card3)]">
            <IcCriativos size={26} />
          </div>
        )}

        {/* rank */}
        <span className="absolute top-2 left-2 text-[10px] font-extrabold px-2 py-[3px] rounded-md text-white shadow"
          style={{ background: top ? 'linear-gradient(90deg,#F5A623,#E50914)' : 'rgba(18,20,26,.78)' }}>
          {top ? '★ TOP' : `#${rank}`}
        </span>

        {/* status */}
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-[3px] rounded-full uppercase tracking-wide"
          style={{ background: c.ativo ? 'var(--green-soft)' : 'var(--red-soft)', color: c.ativo ? 'var(--green)' : 'var(--red)' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.ativo ? 'pulse-dot' : ''}`} style={{ background: 'currentColor' }} />
          {c.ativo ? 'Ativo' : 'Pausado'}
        </span>

        {/* canal + roas */}
        <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-[3px] rounded-md text-white"
          style={{ background: 'rgba(18,20,26,.78)' }}>
          {roasFmt(c.roas)}
        </span>
      </div>

      {/* corpo */}
      <div className="p-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[var(--tx-card3)] shrink-0"><Icone size={12} /></span>
          <p className="text-[12px] font-bold text-[var(--tx-card)] leading-tight truncate" title={c.nome}>{c.nome}</p>
        </div>
        <p className="text-[10px] text-[var(--tx-card3)] leading-tight truncate mb-2.5" title={c.campanha}>{c.campanha}</p>

        <div className="grid grid-cols-2 gap-1.5">
          <Metrica rotulo="Gasto" valor={money(c.custo, moeda)} />
          <Metrica rotulo="CTR" valor={pct(c.ctr)} />
          {ecommerce ? (
            <>
              <Metrica rotulo="Vendas" valor={num(c.compras || 0)} destaque />
              <Metrica rotulo="Receita" valor={money(c.receita, moeda)} verde />
            </>
          ) : (
            <>
              <Metrica rotulo="Result." valor={num(result)} destaque />
              <Metrica rotulo="CPA" valor={money(c.cpa || 0, moeda)} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Metrica({ rotulo, valor, verde, destaque }) {
  return (
    <div className="rounded-lg px-2 py-1.5" style={{ background: 'var(--card-alt)' }}>
      <div className="text-[8px] font-bold uppercase tracking-wide text-[var(--tx-card3)]">{rotulo}</div>
      <div className="text-[12px] font-extrabold leading-tight mt-0.5"
        style={{ color: verde ? 'var(--green)' : destaque ? 'var(--red)' : 'var(--tx-card)' }}>
        {valor}
      </div>
    </div>
  )
}
