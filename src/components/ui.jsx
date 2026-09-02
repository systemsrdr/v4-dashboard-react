import React from 'react'
import { IcChevron } from '../icons'

/* ── CARD BRANCO NEVE ───────────────────────────────── */
export function Card({ children, className = '', pad = true }) {
  return <div className={`snow ${pad ? 'p-5' : ''} ${className}`}>{children}</div>
}

export function CardHead({ titulo, sub, direita }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--card-line)]">
      <div className="min-w-0">
        <h3 className="text-[13px] font-bold text-[var(--tx-card)] truncate">{titulo}</h3>
        {sub && <p className="text-[11px] text-[var(--tx-card3)] mt-0.5">{sub}</p>}
      </div>
      {direita && <div className="flex items-center gap-2 shrink-0">{direita}</div>}
    </div>
  )
}

/* ── DELTA ──────────────────────────────────────────── */
export function Delta({ valor, inverter = false, texto = 'vs período anterior' }) {
  if (valor === null || valor === undefined || !isFinite(valor)) return null
  const positivo = inverter ? valor < 0 : valor >= 0
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-[3px] rounded-md whitespace-nowrap"
      style={{
        background: positivo ? 'var(--green-soft)' : 'var(--red-soft)',
        color: positivo ? 'var(--green)' : 'var(--red)',
      }}
      title={texto}
    >
      {valor >= 0 ? '↑' : '↓'} {Math.abs(valor).toFixed(1).replace('.', ',')}%
    </span>
  )
}

/* ── KPI CARD ───────────────────────────────────────── */
export function Kpi({ icone: Icone, rotulo, valor, sub, delta, inverterDelta, cor = 'var(--red)', dica, carregando }) {
  if (carregando) {
    return (
      <div className="snow p-5 relative overflow-hidden">
        <div className="skeleton h-[3px] absolute top-0 left-0 right-0" />
        <div className="skeleton h-4 w-20 mb-4" />
        <div className="skeleton h-7 w-28 mb-3" />
        <div className="skeleton h-3 w-24" />
      </div>
    )
  }
  return (
    <div className="snow p-5 relative overflow-hidden group transition-shadow hover:shadow-lift">
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: cor }} />
      <div className="flex items-center gap-1.5 mb-3">
        {Icone && <span style={{ color: cor }} className="shrink-0"><Icone size={15} /></span>}
        <span className="text-[10px] font-bold uppercase tracking-[.09em] text-[var(--tx-card3)] truncate">{rotulo}</span>
        {dica && <Dica texto={dica} />}
      </div>
      <div className="text-[25px] font-extrabold text-[var(--tx-card)] leading-none tracking-tight tabular-nums">{valor}</div>
      <div className="flex items-center justify-between gap-2 mt-2.5 min-h-[22px]">
        {sub ? <span className="text-[11px] text-[var(--tx-card2)] truncate">{sub}</span> : <span />}
        <Delta valor={delta} inverter={inverterDelta} />
      </div>
    </div>
  )
}

/* ── DICA (tooltip) ─────────────────────────────────── */
export function Dica({ texto }) {
  return (
    <span className="relative group/d shrink-0">
      <span className="w-[15px] h-[15px] rounded-full border border-[var(--card-line)] bg-[var(--card-alt)] text-[9px] font-bold text-[var(--tx-card3)] inline-flex items-center justify-center cursor-help">?</span>
      <span className="hidden group-hover/d:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[220px] p-2.5 rounded-xl bg-[#12141A] text-[11px] leading-relaxed text-[#C9CFDA] shadow-lift z-50 font-normal normal-case tracking-normal">
        {texto}
      </span>
    </span>
  )
}

/* ── STATUS ─────────────────────────────────────────── */
export function Status({ ativo }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-[3px] rounded-full uppercase tracking-wide"
      style={{ background: ativo ? 'var(--green-soft)' : 'var(--red-soft)', color: ativo ? 'var(--green)' : 'var(--red)' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ativo ? 'pulse-dot' : ''}`} style={{ background: 'currentColor' }} />
      {ativo ? 'Ativo' : 'Pausado'}
    </span>
  )
}

/* ── BLOCO DE SEÇÃO ─────────────────────────────────── */
export function Bloco({ titulo, icone: Icone, children, acao }) {
  return (
    <section className="mb-6 fade-up">
      <div className="flex items-center gap-2.5 mb-3">
        {Icone && <span className="text-[var(--red)]"><Icone size={14} /></span>}
        <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--tx2)] whitespace-nowrap">{titulo}</span>
        <div className="flex-1 h-px bg-[var(--border2)]" />
        {acao}
      </div>
      {children}
    </section>
  )
}

/* ── ABAS ───────────────────────────────────────────── */
export function Abas({ itens, ativo, onChange, tamanho = 'sm' }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {itens.map(i => {
        const on = ativo === i.valor
        return (
          <button
            key={i.valor}
            onClick={() => onChange(i.valor)}
            className={`font-semibold rounded-full border transition-all whitespace-nowrap ${tamanho === 'sm' ? 'text-[11px] px-3 py-1' : 'text-[12px] px-4 py-1.5'} ${
              on
                ? 'bg-[var(--red)] text-white border-[var(--red)]'
                : 'bg-transparent text-[var(--tx-card2)] border-[var(--card-line)] hover:border-[var(--tx-card3)] hover:text-[var(--tx-card)]'
            }`}
          >
            {i.rotulo}
          </button>
        )
      })}
    </div>
  )
}

/* ── GRIDS ──────────────────────────────────────────── */
export const Grid = ({ cols = 4, children, className = '' }) => {
  const map = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5',
  }
  return <div className={`grid ${map[cols]} gap-3 ${className}`}>{children}</div>
}

/* ── VAZIO ──────────────────────────────────────────── */
export function Vazio({ titulo, descricao, icone: Icone }) {
  return (
    <div className="snow py-16 flex flex-col items-center justify-center gap-3 text-center px-6">
      {Icone && <span className="text-[var(--tx-card3)]"><Icone size={30} /></span>}
      <p className="text-[14px] font-bold text-[var(--tx-card)]">{titulo}</p>
      {descricao && <p className="text-[12px] text-[var(--tx-card2)] max-w-sm leading-relaxed">{descricao}</p>}
    </div>
  )
}

/* ── SKELETON DE GRÁFICO ────────────────────────────── */
export const SkelGrafico = ({ altura = 200 }) => (
  <div className="snow" style={{ height: altura }}>
    <div className="skeleton w-full h-full rounded-2xl" />
  </div>
)
