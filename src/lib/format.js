// Helpers de formatação e agregação — portados do dashboard HTML.

export function simb(moeda) { return moeda === 'EUR' ? '\u20ac\u00a0' : 'R$\u00a0' }
export function loc(moeda) { return moeda === 'EUR' ? 'pt-PT' : 'pt-BR' }

export function makeFmt(moeda) {
  const s = simb(moeda), l = loc(moeda)
  return {
    fr: (n) => s + (n || 0).toLocaleString(l, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    frr: (n) => s + (n || 0).toLocaleString(l, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    fn: (n) => Math.round(n || 0).toLocaleString('pt-BR'),
    fp: (n) => (parseFloat(n) || 0).toFixed(2) + '%',
    simb: () => s,
  }
}

export function sn(str, l = 999) {
  return String(str || '').replace(/🟢\s*/g, '').replace(/\[V4RDR&Co\]/g, '').replace(/\[V4&Co\]/g, '').trim().substring(0, l)
}
export function cleanCamp(str) {
  return String(str || '').replace(/🟢\s*/g, '').replace(/\[V4RDR&Co\]/gi, '').replace(/\[V4&Co\]/gi, '')
    .replace(/^\s*\d+#\s*/, '').replace(/\s{2,}/g, ' ').trim() || 'Sem campanha'
}

export function pctChg(a, b) {
  if (!b || b === 0 || !Number.isFinite(b) || !Number.isFinite(a)) return null
  const r = ((a - b) / Math.abs(b) * 100)
  return Number.isFinite(r) ? r : null
}
export function deltaObj(curr, prev, inv = false) {
  const p = pctChg(curr, prev)
  if (p === null) return null
  const up = inv ? (p < 0) : (p >= 0)
  return { up, dn: !up, arrow: p >= 0 ? '↑' : '↓', txt: Math.abs(p).toFixed(1) + '%' }
}

const num = (v) => parseFloat(v || 0)

export function leadReal(r) {
  return num(r.actions_lead) + num(r.actions_leadgen_grouped) + num(r.actions_onsite_conversion_lead_grouped)
    + num(r.actions_offsite_conversion_fb_pixel_lead) + num(r.actions_complete_registration)
}
export function msgReal(r) {
  return num(r.actions_onsite_conversion_messaging_conversation_started_7d)
    + num(r.actions_onsite_conversion_total_messaging_connection)
}

export function campType(row) {
  const obj = String(row.objective || '').toUpperCase()
  const nm = String(row.campaign || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const isMsg = msgReal(row) > 0 || nm.includes('wpp') || nm.includes('mensagem') || nm.includes('mensag') || nm.includes('msg') || nm.includes('whatsapp') || nm.includes('message')
  if (obj.includes('LEADS') || nm.includes('lead') || nm.includes('formulario')) return 'lead'
  if (isMsg) { const wpp = msgReal(row); const pur = num(row.actions_omni_purchase); if (wpp >= pur) return 'msg' }
  if (num(row.actions_omni_purchase) > 0 || obj.includes('SALES')) return 'compra'
  if (isMsg) return 'msg'
  return 'outro'
}

export function groupMeta(meta) {
  const m = {}
  meta.forEach((r) => {
    const k = r.campaign || 'Sem campanha'
    if (!m[k]) m[k] = { c: k, sp: 0, imp: 0, clk: 0, wpp: 0, leads: 0, pur: 0, rev: 0, n: 0, obj: r.objective || '' }
    m[k].sp += num(r.spend); m[k].imp += num(r.impressions); m[k].clk += num(r.clicks)
    m[k].wpp += msgReal(r); m[k].leads += leadReal(r); m[k].pur += num(r.actions_omni_purchase)
    m[k].rev += num(r.action_values_omni_purchase); m[k].n++
  })
  return Object.values(m).map((d) => {
    d.ctr = d.imp > 0 ? d.clk / d.imp * 100 : 0
    d.cpc = d.clk > 0 ? d.sp / d.clk : 0
    d.type = campType({ objective: d.obj, campaign: d.c, actions_omni_purchase: d.pur, actions_onsite_conversion_messaging_conversation_started_7d: d.wpp, actions_lead: d.leads })
    return d
  }).sort((a, b) => b.sp - a.sp)
}

export function groupGoogle(google) {
  const g = {}
  google.forEach((r) => {
    const k = r.campaign || 'Sem campanha'
    if (!g[k]) g[k] = { c: k, sp: 0, imp: 0, clk: 0, conv: 0, n: 0 }
    g[k].sp += num(r.spend); g[k].imp += num(r.impressions || r.imp); g[k].clk += num(r.clicks || r.clk); g[k].conv += num(r.conversions); g[k].n++
  })
  return Object.values(g).map((d) => {
    d.cpa = d.conv > 0 ? d.sp / d.conv : 0
    d.ctr = d.imp > 0 ? d.clk / d.imp * 100 : 0
    d.cpc = d.clk > 0 ? d.sp / d.clk : 0
    return d
  }).sort((a, b) => b.sp - a.sp)
}

export function groupTikTok(tiktok) {
  const g = {}
  tiktok.forEach((r) => {
    const k = r.campaign || 'Sem campanha'
    if (!g[k]) g[k] = { c: k, sp: 0, imp: 0, clk: 0, conv: 0, n: 0 }
    g[k].sp += num(r.spend); g[k].imp += num(r.impressions); g[k].clk += num(r.clicks); g[k].conv += num(r.conversions); g[k].n++
  })
  return Object.values(g).filter((d) => d.sp > 0).map((d) => {
    d.cpa = d.conv > 0 ? d.sp / d.conv : 0
    d.ctr = d.imp > 0 ? d.clk / d.imp * 100 : 0
    d.cpc = d.clk > 0 ? d.sp / d.clk : 0
    return d
  }).sort((a, b) => b.sp - a.sp)
}

// Gradiente vermelho→preto do funil (sem azul)
export function fv4Color(i, n) {
  const t = n > 1 ? i / (n - 1) : 0
  const lerp = (a, b) => Math.round(a + (b - a) * t)
  return `rgb(${lerp(0xE8, 0x11)},${lerp(0x00, 0x10)},${lerp(0x0D, 0x14)})`
}

export function iso(d) { return d.toISOString().split('T')[0] }
