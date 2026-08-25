import { useState } from 'react'
import { IconInfo, IconSun, IconMoon } from '../icons'
import { useTheme } from '../hooks/useTheme'

// Cartão base
export function Card({ children, className = '', bodyClass = '' }) {
  return <div className={`card ${className}`} style={{ boxShadow: 'var(--shadow)' }}><div className={bodyClass}>{children}</div></div>
}

// Tooltip explicativo (origem + cálculo da métrica)
export function InfoTip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <IconInfo width={13} height={13} style={{ color: 'var(--text-3)', cursor: 'help' }} />
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 rounded-lg px-3 py-2 text-[11px] leading-relaxed font-normal normal-case tracking-normal"
          style={{ background: 'var(--ink)', color: 'var(--bg)', minWidth: 190, maxWidth: 260, boxShadow: 'var(--shadow-lg)' }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

// KPI card — ícone SVG (não emoji), label, valor, sub, delta, tooltip
export function KpiCard({ icon: Icon, label, value, sub, delta, stripe = 'red', tip }) {
  const stripeColors = {
    red: 'var(--red)', grn: 'var(--grn)', amb: 'var(--amb)', ink: 'var(--ink)', pur: '#9333EA',
  }
  return (
    <div className="card relative overflow-hidden p-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: stripeColors[stripe] || 'var(--red)' }} />
      {Icon && <Icon width={18} height={18} style={{ color: 'var(--text-2)' }} className="mb-2" />}
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
        <span>{label}</span>{tip && <InfoTip text={tip} />}
      </div>
      <div className="text-2xl font-extrabold leading-none mb-1 tracking-tight" style={{ color: 'var(--text)' }}>{value}</div>
      {sub && <div className="text-[11px]" style={{ color: 'var(--text-2)' }}>{sub}</div>}
      {delta && (
        <div
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded mt-1.5"
          style={delta.up
            ? { background: 'var(--grn-2)', color: 'var(--grn)' }
            : { background: 'var(--red-2)', color: 'var(--red)' }}
        >
          {delta.arrow} {delta.txt} vs anterior
        </div>
      )}
    </div>
  )
}

// Status pill minimalista — RODANDO (ativo) vs PAUSADO
export function StatusPill({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
      style={active
        ? { background: 'var(--grn-2)', color: 'var(--grn)' }
        : { background: 'var(--red-2)', color: 'var(--red)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {active ? 'Rodando' : 'Pausado'}
    </span>
  )
}

// Bloco de seção com título e linha
export function SectionHead({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 py-2 mb-2">
      {Icon && <Icon width={15} height={15} style={{ color: 'var(--text-2)' }} />}
      <span className="text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-2)' }}>{title}</span>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

// Toggle de tema
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-2)' }}
    >
      {theme === 'dark' ? <IconSun width={16} height={16} /> : <IconMoon width={16} height={16} />}
    </button>
  )
}
