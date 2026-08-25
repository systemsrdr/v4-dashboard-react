import { useMemo, useState } from 'react'
import { KpiCard, SectionHead } from './ui'
import { FunnelV4 } from './FunnelV4'
import { GaugeChart } from './GaugeChart'
import { VersusPanel, GenderDonut, AgeBars } from './Audience'
import { GeoMap } from './GeoMap'
import { deltaObj } from '../lib/format'
import { IconWallet, IconCart, IconTarget, IconTrendUp, IconTicket, IconMessage, IconClipboard, IconGlobe, IconLayers, IconUsers, IconMap } from '../icons'

const safeInt = (v) => { const n = Math.round(v); return Number.isFinite(n) ? n : 0 }

export function Overview({ data, C, fmt, demo }) {
  const { meta: mG, google: gG, prev, fin, funilSrc, geo } = data
  const [tab, setTab] = useState('all')
  const isEc = C.tipo === 'ec'

  const mSp = mG.reduce((a, x) => a + x.sp, 0)
  const gSp = gG.reduce((a, x) => a + x.sp, 0)
  const totalSp = mSp + gSp
  const wpp = mG.reduce((a, x) => a + (x.wpp || 0), 0)
  const leads = mG.reduce((a, x) => a + (x.leads || 0), 0)
  const gConv = gG.reduce((a, x) => a + x.conv, 0)
  const pur = fin.v || mG.reduce((a, x) => a + (x.pur || 0), 0)
  const rev = fin.fat || mG.reduce((a, x) => a + (x.rev || 0), 0)
  const hasGoogle = (C.googleIds && C.googleIds.length > 0) && gSp > 0

  // ── Hero KPIs ──
  const heroKpis = isEc
    ? [
      { icon: IconWallet, label: 'Investimento', value: fmt.fr(totalSp), sub: `Meta ${fmt.fr(mSp)} · Google ${fmt.fr(gSp)}`, delta: deltaObj(totalSp, prev.mSp + prev.gSp), stripe: 'red' },
      { icon: IconCart, label: 'Vendas', value: fmt.fn(pur), sub: `Receita ${fmt.fr(rev)}`, delta: deltaObj(pur, prev.v), stripe: 'grn' },
      { icon: IconTrendUp, label: 'ROAS', value: totalSp > 0 && rev > 0 ? (rev / totalSp).toFixed(2) + 'x' : '—', sub: 'Receita ÷ Investimento', stripe: 'pur', tip: 'Origem: Meta/Google + planilha → Receita ÷ Investimento total.' },
      { icon: IconTarget, label: 'CPA', value: pur > 0 ? fmt.fr(totalSp / pur) : '—', sub: 'Custo por venda', stripe: 'ink', tip: 'Origem: mídia + planilha → Investimento ÷ Vendas.' },
      { icon: IconTicket, label: 'Ticket Médio', value: pur > 0 ? fmt.fr(rev / pur) : '—', sub: `${fmt.fn(pur)} vendas`, stripe: 'amb', tip: 'Origem: planilha → Receita ÷ Vendas.' },
    ]
    : [
      { icon: IconWallet, label: 'Investimento', value: fmt.fr(totalSp), sub: `Meta ${fmt.fr(mSp)} · Google ${fmt.fr(gSp)}`, delta: deltaObj(totalSp, prev.mSp + prev.gSp), stripe: 'red' },
      { icon: IconTarget, label: 'Resultados', value: fmt.fn(wpp + leads + gConv), sub: `WhatsApp ${fmt.fn(wpp)} · Leads ${fmt.fn(leads)}`, delta: deltaObj(wpp + leads, prev.wpp + prev.leads), stripe: 'grn' },
      { icon: IconTrendUp, label: 'Custo/Result.', value: (wpp + leads + gConv) > 0 ? fmt.fr(totalSp / (wpp + leads + gConv)) : '—', sub: 'Investimento ÷ Resultados', stripe: 'amb', tip: 'Origem: mídia → Investimento ÷ (WhatsApp + Leads + Conv. Google).' },
      { icon: IconMessage, label: 'WhatsApp', value: fmt.fn(wpp), sub: 'Conversas iniciadas', delta: deltaObj(wpp, prev.wpp), stripe: 'ink' },
      { icon: IconClipboard, label: 'Leads', value: fmt.fn(leads), sub: 'Formulário / CRM', delta: deltaObj(leads, prev.leads), stripe: 'pur' },
    ]

  // ── Gauges (metas/KPIs) ──
  const gauges = isEc
    ? [
      { title: 'ROAS', value: +(totalSp > 0 && rev > 0 ? (rev / totalSp) : 0).toFixed(2), max: 5, unit: '', label: 'Meta de retorno', tip: 'Origem: mídia + planilha → Receita ÷ Investimento. Meta 5x.' },
      { title: 'Vendas', value: safeInt(pur), max: Math.max(50, Math.ceil(safeInt(pur) * 1.3) || 50), unit: '', label: 'no período', tip: 'Origem: planilha de vendas.' },
      { title: 'Ticket Médio', value: safeInt(pur > 0 ? rev / pur : 0), max: Math.max(100, Math.ceil(safeInt(pur > 0 ? rev / pur : 0) * 1.4) || 100), unit: fmt.simb(), label: 'Receita ÷ Vendas', tip: 'Origem: planilha → Receita ÷ Vendas.' },
    ]
    : [
      { title: 'Resultados', value: safeInt(wpp + leads + gConv), max: Math.max(50, Math.ceil(safeInt(wpp + leads + gConv) * 1.3) || 50), unit: '', label: 'WhatsApp + Leads', tip: 'Origem: Meta/Google API.' },
      { title: 'Custo/Result.', value: safeInt((wpp + leads + gConv) > 0 ? totalSp / (wpp + leads + gConv) : 0), max: 100, unit: fmt.simb(), label: 'Meta ≤ 50', tip: 'Origem: mídia → Investimento ÷ Resultados.', invert: true },
      { title: 'Investimento', value: safeInt(totalSp), max: Math.max(1000, Math.ceil(safeInt(totalSp) * 1.2) || 1000), unit: fmt.simb(), label: 'no período', tip: 'Gasto total Meta + Google.' },
    ]

  // ── Funil V4 (steps por plataforma + funilSource) ──
  const funnelSteps = useMemo(() => buildFunnel(tab, { mG, gG, C, fin, funilSrc, fmt }), [tab, mG, gG, C, fin, funilSrc]) // eslint-disable-line

  // ── VS Meta vs Google ──
  const vsRows = useMemo(() => buildVs({ mG, gG, isEc, fin, fmt }), [mG, gG, isEc, fin]) // eslint-disable-line

  // ── Demografia ──
  const demoData = useMemo(() => buildDemo(demo), [demo])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3.5" style={{ gridTemplateColumns: `repeat(${heroKpis.length}, minmax(0,1fr))` }}>
        {heroKpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      <div>
        <SectionHead icon={IconTarget} title="Metas & KPIs" />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: `repeat(${gauges.length}, minmax(0,1fr))` }}>
          {gauges.map((g, i) => <GaugeChart key={i} {...g} />)}
        </div>
      </div>

      <div>
        <SectionHead icon={IconLayers} title="Funil de conversão" />
        <FunnelV4 steps={funnelSteps} tab={tab} onTab={setTab} fmt={fmt} />
      </div>

      {hasGoogle && (
        <div>
          <SectionHead icon={IconGlobe} title="Meta Ads vs Google Ads" />
          <VersusPanel rows={vsRows} period="" />
        </div>
      )}

      {geo && geo.length > 0 && (
        <div>
          <SectionHead icon={IconMap} title="Localização" />
          <GeoMap geo={geo} pais={C.pais} fmt={fmt} />
        </div>
      )}

      {demoData && (
        <div>
          <SectionHead icon={IconUsers} title="Público" />
          <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
            <AgeBars data={demoData.ages} />
            <GenderDonut male={demoData.gender.male} female={demoData.gender.female} other={demoData.gender.other} />
          </div>
        </div>
      )}
    </div>
  )
}

// Constrói os steps do funil conforme plataforma e fonte de fundo
function buildFunnel(plat, { mG, gG, C, fin, funilSrc, fmt }) {
  const mI = mG.reduce((a, x) => a + x.imp, 0), mC = mG.reduce((a, x) => a + x.clk, 0), mSp = mG.reduce((a, x) => a + x.sp, 0)
  const gI = gG.reduce((a, x) => a + x.imp, 0), gC = gG.reduce((a, x) => a + x.clk, 0), gSp = gG.reduce((a, x) => a + x.sp, 0)
  const gConv = gG.reduce((a, x) => a + x.conv, 0)
  const isEc = C.tipo === 'ec'
  let sp, imp, clk
  if (plat === 'meta') { sp = mSp; imp = mI; clk = mC }
  else if (plat === 'google') { sp = gSp; imp = gI; clk = gC }
  else { sp = mSp + gSp; imp = mI + gI; clk = mC + gC }

  const fs = funilSrc || {}
  const wpp = mG.reduce((a, x) => a + (x.wpp || 0), 0), leads = mG.reduce((a, x) => a + (x.leads || 0), 0)
  const purMeta = fin.v || mG.reduce((a, x) => a + (x.pur || 0), 0)
  const revMeta = fin.fat || mG.reduce((a, x) => a + (x.rev || 0), 0)

  const steps = [
    { l: 'Valor Gasto', v: fmt.fr(sp), sideL: null, side: null },
    { l: 'Impressões', v: fmt.fn(imp), sideL: 'CPM', side: imp > 0 ? fmt.frr(sp / imp * 1000) : null },
    { l: 'Cliques', v: fmt.fn(clk), sideL: 'CPC', side: clk > 0 ? fmt.frr(sp / clk) : null },
    { l: 'Visitas', v: fmt.fn(clk), sideL: 'CPV', side: clk > 0 ? fmt.frr(sp / clk) : null },
  ]
  const src = C.funilSource
  if (src === 'kommo') {
    const mqlV = fs.mql || (wpp + leads)
    steps.push({ l: 'Leads (MQL)', v: fmt.fn(mqlV), sideL: 'CPL/MQL', side: mqlV > 0 ? fmt.frr(sp / mqlV) : null })
    if (fs.sql > 0) steps.push({ l: 'Leads (SQL)', v: fmt.fn(fs.sql), sideL: 'CPL/SQL', side: fmt.frr(sp / fs.sql) })
    if (fs.sqo > 0) steps.push({ l: 'Oportunidades (SQO)', v: fmt.fn(fs.sqo), sideL: 'Custo/SQO', side: fmt.frr(sp / fs.sqo) })
    steps.push({ l: 'Vendas', v: fmt.fn(fs.vendas || 0), sideL: 'CPA', side: fs.vendas > 0 ? fmt.frr(sp / fs.vendas) : null })
    if (fs.receita > 0) steps.push({ l: 'Receita', v: fmt.fr(fs.receita), sideL: 'ROAS', side: sp > 0 ? (fs.receita / sp).toFixed(2) : null })
  } else if (src === 'shopify' || src === 'tray') {
    const vend = fs.vendas || purMeta, rec = fs.receita || revMeta
    if ((fs.carrinho || 0) > 0) steps.push({ l: 'Adições ao Carrinho', v: fmt.fn(fs.carrinho), sideL: 'Custo/ATC', side: fmt.frr(sp / fs.carrinho) })
    steps.push({ l: 'Vendas', v: fmt.fn(vend), sideL: 'CPA', side: vend > 0 ? fmt.frr(sp / vend) : null })
    steps.push({ l: 'Receita', v: fmt.fr(rec), sideL: 'ROAS', side: sp > 0 && rec > 0 ? (rec / sp).toFixed(2) : null })
  } else if (isEc) {
    steps.push({ l: 'Vendas', v: fmt.fn(purMeta), sideL: 'CPA', side: purMeta > 0 ? fmt.frr(sp / purMeta) : null })
    steps.push({ l: 'Receita', v: fmt.fr(revMeta), sideL: 'ROAS', side: sp > 0 && revMeta > 0 ? (revMeta / sp).toFixed(2) : null })
  } else {
    steps.push({ l: 'WhatsApp', v: fmt.fn(wpp), sideL: 'Custo/conversa', side: wpp > 0 ? fmt.frr(sp / wpp) : null })
    steps.push({ l: 'Leads', v: fmt.fn(leads), sideL: 'CPL', side: leads > 0 ? fmt.frr(sp / leads) : null })
    if (plat !== 'meta' && gConv > 0) steps.push({ l: 'Conv. Google', v: fmt.fn(Math.round(gConv)), sideL: 'CPA', side: fmt.frr(gSp / gConv) })
  }
  return steps
}

function buildVs({ mG, gG, isEc, fin, fmt }) {
  const mSp = mG.reduce((a, x) => a + x.sp, 0), gSp = gG.reduce((a, x) => a + x.sp, 0)
  const mImp = mG.reduce((a, x) => a + x.imp, 0), gImp = gG.reduce((a, x) => a + x.imp, 0)
  const mClk = mG.reduce((a, x) => a + x.clk, 0), gClk = gG.reduce((a, x) => a + x.clk, 0)
  const mCtr = mImp > 0 ? mClk / mImp * 100 : 0, gCtr = gImp > 0 ? gClk / gImp * 100 : 0
  const mCpc = mClk > 0 ? mSp / mClk : 0, gCpc = gClk > 0 ? gSp / gClk : 0
  const big = (v) => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(1) + 'k' : fmt.fn(v)
  const rows = [
    row('Investimento', mSp, gSp, fmt.fr),
    row('Impressões', mImp, gImp, big),
    row('Cliques', mClk, gClk, fmt.fn),
    row('CTR', mCtr, gCtr, (v) => v.toFixed(2) + '%'),
    row('CPC', mCpc, gCpc, (v) => fmt.frr(v), true),
  ]
  if (isEc) {
    const mPur = fin.v || mG.reduce((a, x) => a + (x.pur || 0), 0)
    const gV = fin.gV || gG.reduce((a, x) => a + x.conv, 0)
    const mRev = fin.fat || mG.reduce((a, x) => a + (x.rev || 0), 0)
    const gRev = fin.gFat || 0
    rows.push(row('Vendas', mPur, gV, fmt.fn))
    rows.push(row('Receita', mRev, gRev, fmt.fr))
    rows.push(row('ROAS', mSp > 0 && mRev > 0 ? mRev / mSp : 0, gSp > 0 && gRev > 0 ? gRev / gSp : 0, (v) => v.toFixed(2) + 'x'))
  } else {
    const mWpp = mG.reduce((a, x) => a + (x.wpp || 0), 0), mLeads = mG.reduce((a, x) => a + (x.leads || 0), 0)
    const gConv = gG.reduce((a, x) => a + x.conv, 0)
    const mRes = mWpp + mLeads
    rows.push(row('Resultados', mRes, gConv, fmt.fn))
    rows.push(row('Custo/Result.', mRes > 0 ? mSp / mRes : 0, gConv > 0 ? gSp / gConv : 0, fmt.fr, true))
  }
  return rows
}

function row(label, mNum, gNum, fmtFn, inv = false) {
  let mWin = false, gWin = false
  if (inv) {
    if (mNum > 0 && (gNum === 0 || mNum < gNum)) mWin = true
    else if (gNum > 0) gWin = true
  } else {
    if (mNum > gNum) mWin = true
    else if (gNum > mNum) gWin = true
  }
  return { label, mNum, gNum, mFmt: fmtFn(mNum), gFmt: fmtFn(gNum), mWin, gWin, inv }
}

function buildDemo(demo) {
  if (!demo || !demo.length) return null
  const ages = {}, gender = { male: 0, female: 0, other: 0 }
  const ORDER = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  demo.forEach((r) => {
    const age = String(r.age || 'unknown')
    const gen = String(r.gender || '').toLowerCase()
    const clk = parseInt(r.clicks || r.impressions || 0)
    if (!ages[age]) ages[age] = { age, Masculino: 0, Feminino: 0 }
    if (gen === 'male' || gen === 'm') { ages[age].Masculino += clk; gender.male += clk }
    else if (gen === 'female' || gen === 'f') { ages[age].Feminino += clk; gender.female += clk }
    else gender.other += clk
  })
  const list = Object.values(ages).filter((a) => a.age !== 'unknown').sort((a, b) => {
    const ai = ORDER.indexOf(a.age), bi = ORDER.indexOf(b.age)
    if (ai >= 0 && bi >= 0) return ai - bi
    return a.age.localeCompare(b.age)
  })
  return { ages: list, gender }
}
