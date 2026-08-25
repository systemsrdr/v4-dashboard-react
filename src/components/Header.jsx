import { useState } from 'react'
import { LogoV4, IconLogout, IconCalendar, IconGrid } from '../icons'
import { ThemeToggle } from './ui'

// Chevron simples inline (evita novo arquivo de ícone)
const IconChevron = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6" /></svg>)

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}

const AV_COLORS = ['#E8000D', '#111014', '#10B981', '#9333EA', '#F59E0B', '#EA4335']
function colorFor(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return AV_COLORS[h % AV_COLORS.length]
}

export function Header({ client, slug, dateFrom, dateTo, onDate, onPreset, onApply, activePreset, onLogout }) {
  const [menu, setMenu] = useState(false)
  const presets = [
    { id: 'this_month', label: 'Este mês' },
    { id: 'prev_month', label: 'Mês anterior' },
    { id: '30d', label: '30 dias' },
    { id: '7d', label: '7 dias' },
  ]
  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Linha 1 — logo à esquerda, perfil do usuário à direita */}
      <div className="flex items-center gap-3 px-5" style={{ height: 58, borderBottom: '1px solid var(--border)' }}>
        {/* Marca V4 */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: 'var(--red)' }}>
            <LogoV4 width={19} height={15} style={{ color: '#fff' }} />
          </span>
          <div className="leading-none">
            <div className="text-[15px] font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>V4 Performance</div>
            <div className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-3)' }}>Intelligence Dashboards</div>
          </div>
        </div>

        {/* Perfil do usuário logado — canto superior direito */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="relative" onMouseLeave={() => setMenu(false)}>
            <button
              onClick={() => setMenu((m) => !m)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition-colors"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-center rounded-full text-[12px] font-extrabold text-white" style={{ width: 30, height: 30, background: colorFor(slug) }}>
                {initials(client.nome)}
              </div>
              <div className="leading-tight text-left">
                <div className="text-[12px] font-bold max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--text)' }}>{client.nome}</div>
                <div className="text-[9px] font-semibold" style={{ color: 'var(--grn)' }}>● conectado</div>
              </div>
              <IconChevron width={14} height={14} style={{ color: 'var(--text-3)' }} />
            </button>
            {menu && (
              <div className="absolute right-0 mt-1 w-52 rounded-xl border py-1.5 z-50" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{client.nome}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>{client.seg || 'Cliente'} · {client.moeda}</div>
                </div>
                <a href="?" className="flex items-center gap-2 px-3 py-2 text-[12px] font-semibold" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>
                  <IconGrid width={14} height={14} /> Trocar de cliente
                </a>
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-left" style={{ color: 'var(--red)' }}>
                  <IconLogout width={14} height={14} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Linha 2 — controles de período */}
      <div className="flex items-center gap-1.5 px-5 flex-wrap" style={{ height: 52 }}>
        <div className="flex items-center gap-1.5">
          <IconCalendar width={14} height={14} style={{ color: 'var(--text-3)' }} />
          <input type="date" value={dateFrom} onChange={(e) => onDate('from', e.target.value)} className="rounded-lg border px-2 py-1.5 text-[11px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>—</span>
          <input type="date" value={dateTo} onChange={(e) => onDate('to', e.target.value)} className="rounded-lg border px-2 py-1.5 text-[11px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
        </div>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onPreset(p.id)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors"
            style={activePreset === p.id
              ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }
              : { background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }}
          >
            {p.label}
          </button>
        ))}
        <button onClick={onApply} className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: 'var(--red)' }}>Aplicar →</button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="text-center py-6 text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>
      Desenvolvido por <span className="font-bold" style={{ color: 'var(--text-2)' }}>RDR V4 Company</span>
    </footer>
  )
}
