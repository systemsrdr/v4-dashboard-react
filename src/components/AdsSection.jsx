import { useMemo, useState } from 'react'
import { sn, leadReal, msgReal } from '../lib/format'
import { StatusPill, KpiCard } from './ui'
import { IconFilm, IconWallet, IconCart, IconTarget, IconTrophy } from '../icons'

function groupAds(adsRaw) {
  const m = {}
  const num = (v) => parseFloat(v || 0)
  adsRaw.forEach((r) => {
    const k = (r.ad_id || r.ad_name || '') + '|' + (r.campaign || '')
    if (!m[k]) m[k] = { id: r.ad_id || '', name: r.ad_name || 'Sem nome', camp: r.campaign || '', status: (r.ad_effective_status || r.ad_status || '').toString().toUpperCase(), thumb: r.thumbnail_url || r.creative_url || '', sp: 0, imp: 0, clk: 0, pur: 0, rev: 0, wpp: 0, leads: 0 }
    const a = m[k]
    a.sp += num(r.spend); a.imp += num(r.impressions); a.clk += num(r.clicks)
    a.pur += num(r.actions_omni_purchase); a.rev += num(r.action_values_omni_purchase)
    a.wpp += msgReal(r); a.leads += leadReal(r)
    if (!a.thumb && (r.thumbnail_url || r.creative_url)) a.thumb = r.thumbnail_url || r.creative_url
  })
  return Object.values(m).map((a) => {
    a.ctr = a.imp > 0 ? a.clk / a.imp * 100 : 0
    a.cpc = a.clk > 0 ? a.sp / a.clk : 0
    a.conv = a.pur + a.wpp + a.leads
    a.cpa = a.conv > 0 ? a.sp / a.conv : 0
    const st = a.status
    if (st === 'ACTIVE') a.active = true
    else if (/PAUSED|ARCHIVED|DELETED|DISABLED|WITH_ISSUES|PENDING|IN_PROCESS/.test(st)) a.active = false
    else a.active = a.sp > 0
    return a
  })
}

export function AdsSection({ adsRaw, tipo, fmt, loading }) {
  const [sort, setSort] = useState('conv')
  const [filter, setFilter] = useState('all')
  const isEc = tipo === 'ec'
  const ads = useMemo(() => groupAds(adsRaw), [adsRaw])

  const filtered = useMemo(() => {
    let a = [...ads]
    if (filter === 'active') a = a.filter((x) => x.active)
    else if (filter === 'paused') a = a.filter((x) => !x.active)
    const sorters = {
      spend: (x, y) => y.sp - x.sp, conv: (x, y) => y.conv - x.conv, rev: (x, y) => y.rev - x.rev,
      cpa: (x, y) => (x.cpa || 9e9) - (y.cpa || 9e9), ctr: (x, y) => y.ctr - x.ctr,
    }
    a.sort(sorters[sort] || sorters.conv)
    return a
  }, [ads, filter, sort])

  const sp = ads.reduce((a, x) => a + x.sp, 0)
  const active = ads.filter((a) => a.active).length
  const totalConv = ads.reduce((a, x) => a + x.conv, 0)
  const totalRev = ads.reduce((a, x) => a + x.rev, 0)
  const best = ads.filter((a) => a.conv > 0).sort((a, b) => b.conv - a.conv)[0]

  const sortBtns = [
    { id: 'spend', label: 'Maior Gasto' }, { id: 'conv', label: 'Mais Result.' },
    { id: 'rev', label: 'Maior Receita' }, { id: 'cpa', label: 'Menor CPA' }, { id: 'ctr', label: 'CTR' },
  ]
  const filterBtns = [
    { id: 'all', label: 'Todos' }, { id: 'active', label: 'Rodando' }, { id: 'paused', label: 'Pausados' },
  ]

  return (
    <div>
      <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <KpiCard icon={IconFilm} label="Anúncios" value={ads.length.toLocaleString('pt-BR')} sub={`${active} rodando · ${ads.length - active} pausados`} stripe="red" />
        <KpiCard icon={IconWallet} label="Investimento" value={fmt.fr(sp)} sub={`${ads.length} criativos`} stripe="ink" />
        <KpiCard icon={isEc ? IconCart : IconTarget} label={isEc ? 'Vendas' : 'Resultados'} value={fmt.fn(totalConv)} sub={isEc ? `Receita ${fmt.fr(totalRev)}` : 'WhatsApp + Leads'} stripe="grn" />
        <KpiCard icon={IconTrophy} label="Top Criativo" value={best ? sn(best.name, 14) : '—'} sub={best ? `${fmt.fn(best.conv)} result.` : ''} stripe="amb" />
      </div>

      <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="flex items-center gap-1.5 px-4 py-3 border-b flex-wrap" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>Ordenar</span>
          {sortBtns.map((b) => (
            <button key={b.id} onClick={() => setSort(b.id)} className="px-3 py-1.5 rounded-full text-[11px] font-semibold border" style={sort === b.id ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' } : { background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>{b.label}</button>
          ))}
          <span className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>Status</span>
          {filterBtns.map((b) => (
            <button key={b.id} onClick={() => setFilter(b.id)} className="px-3 py-1.5 rounded-full text-[11px] font-semibold border" style={filter === b.id ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' } : { background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>{b.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-[13px] font-semibold" style={{ color: 'var(--text-3)' }}>Carregando anúncios…</div>
        ) : !filtered.length ? (
          <div className="text-center py-12 px-8 text-[13px] font-semibold leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-3)' }}>
            Nenhum anúncio para este filtro. Anúncios pausados só aparecem se tiveram entrega no período — tente um intervalo mais amplo.
          </div>
        ) : (
          <div className="p-4 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {filtered.map((a, i) => (
              <div key={i} className="card overflow-hidden transition-transform hover:-translate-y-0.5" style={{ border: i === 0 ? '2px solid var(--red)' : '1px solid var(--border)' }}>
                <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                  {a.thumb
                    ? <img src={a.thumb} alt={a.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    : <div className="w-full h-full flex items-center justify-center text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Sem imagem</div>}
                  <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded" style={i === 0 ? { background: 'rgba(245,158,11,.95)', color: '#fff' } : { background: 'rgba(0,0,0,.7)', color: '#fff' }}>
                    {i === 0 ? 'Top' : `#${i + 1}`}
                  </div>
                  <div className="absolute top-2 right-2"><StatusPill active={a.active} /></div>
                </div>
                <div className="p-3">
                  <div className="text-[11px] font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--text)' }} title={a.name}>{sn(a.name, 30)}</div>
                  <div className="grid grid-cols-2 gap-1">
                    <Stat label="Gasto" value={fmt.fr(a.sp)} />
                    <Stat label="CTR" value={fmt.fp(a.ctr)} />
                    {isEc
                      ? <><Stat label="Vendas" value={fmt.fn(a.pur || a.conv)} accent="grn" /><Stat label="Receita" value={fmt.fr(a.rev)} /></>
                      : <><Stat label="Result." value={fmt.fn(a.conv)} accent="grn" /><Stat label="CPA" value={a.cpa > 0 ? fmt.fr(a.cpa) : '—'} /></>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  const color = accent === 'grn' ? 'var(--grn)' : 'var(--text)'
  return (
    <div className="rounded-md px-2 py-1.5 border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
      <div className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>{label}</div>
      <div className="text-[12px] font-bold" style={{ color }}>{value}</div>
    </div>
  )
}
