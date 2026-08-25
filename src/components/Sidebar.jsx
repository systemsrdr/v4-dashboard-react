import { IconGrid, IconLayers, IconMap, IconFilm, LogoMeta, LogoGoogle, LogoTikTok, IconBriefcase, IconCart, IconCheck } from '../icons'

// Sidebar estreita, preta fixa, só ícones brancos.
const fonteIcon = { kommo: IconBriefcase, shopify: IconCart, tray: IconCheck }

export function Sidebar({ active, onNav, hasTikTok, funilSources = [] }) {
  const fonteItems = funilSources.map((s, i) => ({
    id: funilSources.length > 1 ? `fonte-${s.tipo}` : 'fonte',
    label: s.label,
    Icon: fonteIcon[s.tipo] || IconLayers,
  }))
  const items = [
    { id: 'overview', label: 'Visão Geral', Icon: IconGrid },
    { id: 'meta', label: 'Meta Ads', Icon: LogoMeta },
    { id: 'google', label: 'Google Ads', Icon: LogoGoogle },
    ...(hasTikTok ? [{ id: 'tiktok', label: 'TikTok Ads', Icon: LogoTikTok }] : []),
    ...fonteItems,
    { id: 'ads', label: 'Anúncios', Icon: IconFilm },
  ]
  return (
    <nav
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center py-4 gap-1"
      style={{ width: 68, background: '#000' }}
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-3" style={{ background: 'var(--red)' }}>
        <svg viewBox="0 0 100 80" width={22} height={17}><polygon points="15,18 50,65 85,18" fill="#fff" /></svg>
      </div>
      {items.map(({ id, label, Icon }) => {
        const on = active === id
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            title={label}
            aria-label={label}
            aria-current={on ? 'page' : undefined}
            className="group relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors"
            style={{ background: on ? 'var(--red)' : 'transparent', color: '#fff' }}
          >
            <Icon width={20} height={20} style={{ color: '#fff', opacity: on ? 1 : 0.62 }} />
            <span
              className="absolute left-full ml-2 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
              style={{ background: '#000', color: '#fff' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
