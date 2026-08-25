import { LogoV4, IconLogout, IconCalendar } from '../icons'
import { ThemeToggle } from './ui'

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
  const presets = [
    { id: 'this_month', label: 'Este mês' },
    { id: 'prev_month', label: 'Mês anterior' },
    { id: '30d', label: '30 dias' },
    { id: '7d', label: '7 dias' },
  ]
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-5 border-b flex-wrap"
      style={{ height: 60, background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Marca V4 em destaque */}
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: 'var(--red)' }}>
          <LogoV4 width={18} height={14} style={{ color: '#fff' }} />
        </span>
        <div className="leading-none">
          <div className="text-[14px] font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>V4 Performance</div>
          <div className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-3)' }}>Intelligence Dashboards</div>
        </div>
      </div>

      <div className="w-px h-6" style={{ background: 'var(--border-2)' }} />

      {/* Perfil do cliente ativo (foto + nome) */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-full text-[12px] font-extrabold text-white"
          style={{ width: 32, height: 32, background: colorFor(slug) }}
        >
          {initials(client.nome)}
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-bold max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--text)' }}>{client.nome}</div>
          {client.moeda === 'EUR' && <div className="text-[9px] font-bold" style={{ color: '#9333EA' }}>EUR €</div>}
        </div>
      </div>

      {/* Controles à direita */}
      <div className="ml-auto flex items-center gap-1.5 flex-wrap">
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
        <ThemeToggle />
        <button
          onClick={onLogout}
          aria-label="Sair"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors"
          style={{ background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }}
        >
          <IconLogout width={14} height={14} /> Sair
        </button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="text-center py-6 text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>
      Dashboard desenvolvido por <span className="font-bold" style={{ color: 'var(--text-2)' }}>V4 Company</span>
    </footer>
  )
}
