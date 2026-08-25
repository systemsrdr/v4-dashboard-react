import { useEffect, useRef } from 'react'
import { GEO_COORDS } from '../lib/clients'
import { InfoTip } from './ui'

// Mapa de geografia — estrutura mantida idêntica ao dashboard original (Leaflet + CartoDB).
// Carrega Leaflet do CDN sob demanda para não exigir bundle extra.
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L)
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(css)
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    s.onload = () => resolve(window.L)
    document.body.appendChild(s)
  })
}

export function GeoMap({ geo, pais, fmt }) {
  const mapEl = useRef(null)
  const mapObj = useRef(null)

  const agg = {}
  geo.forEach((r) => {
    const k = r.region
    if (!agg[k]) agg[k] = { region: k, clk: 0, imp: 0, sp: 0 }
    agg[k].clk += parseFloat(r.clicks || 0)
    agg[k].imp += parseFloat(r.impressions || 0)
    agg[k].sp += parseFloat(r.spend || 0)
  })
  const list = Object.values(agg).sort((a, b) => b.clk - a.clk)
  const maxClk = Math.max(...list.map((x) => x.clk), 1)

  useEffect(() => {
    let alive = true
    loadLeaflet().then((L) => {
      if (!alive || !mapEl.current) return
      const center = pais === 'PT' ? [39.5, -8.0] : [-15.0, -52.0]
      const zoom = pais === 'PT' ? 6 : 4
      if (!mapObj.current) {
        mapObj.current = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: false }).setView(center, zoom)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapObj.current)
      } else {
        mapObj.current.eachLayer((l) => { if (l instanceof L.CircleMarker) mapObj.current.removeLayer(l) })
        mapObj.current.setView(center, zoom)
      }
      list.forEach((x) => {
        const co = GEO_COORDS[x.region] || GEO_COORDS[x.region.replace(' District', '')]
        if (!co) return
        const raio = 8 + Math.sqrt(x.clk / maxClk) * 32
        L.circleMarker(co, { radius: raio, color: '#E8000D', weight: 1.5, fillColor: '#E8000D', fillOpacity: 0.35 })
          .bindPopup(`<b>${x.region.replace(' District', '')}</b><br>${fmt.fn(x.clk)} cliques<br>${fmt.fr(x.sp)} investido`)
          .addTo(mapObj.current)
      })
      setTimeout(() => mapObj.current && mapObj.current.invalidateSize(), 100)
    })
    return () => { alive = false }
  }, [geo, pais]) // eslint-disable-line

  if (!geo || !geo.length) return null

  return (
    <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
      <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
          <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Alcance por Região</div>
          <InfoTip text="Origem: Meta Ads API (breakdown region). Cliques e investimento por localização." />
        </div>
        <div ref={mapEl} style={{ height: 340, width: '100%', background: 'var(--surface-2)' }} />
      </div>
      <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Top Regiões</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>Por cliques no período</div>
        </div>
        <div className="py-1.5 overflow-y-auto" style={{ maxHeight: 340 }}>
          {list.slice(0, 15).map((x, i) => (
            <div key={i} className="grid items-center px-4 py-2 border-b gap-2.5" style={{ gridTemplateColumns: '1fr auto', borderColor: 'var(--border)' }}>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--text)' }}>
                  <span className="text-[9px] font-extrabold w-4" style={{ color: 'var(--text-3)' }}>{i + 1}</span>
                  {x.region.replace(' District', '')}
                </div>
                <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(x.clk / maxClk * 100).toFixed(1)}%`, background: 'var(--red)' }} />
                </div>
              </div>
              <div className="text-[12px] font-extrabold text-right whitespace-nowrap" style={{ color: 'var(--text)' }}>
                {fmt.fn(x.clk)}
                <div className="text-[9px] font-semibold" style={{ color: 'var(--text-3)' }}>{fmt.fr(x.sp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
