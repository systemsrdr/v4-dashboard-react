// ══ MOEDA DINÂMICA ══════════════════════════════════════════
const SIM = { BRL: 'R$', EUR: '€' }

/** Valor compacto: R$ 12,4k · € 1,2M */
export function money(v, moeda = 'BRL') {
  const n = parseFloat(v) || 0
  const s = SIM[moeda] || 'R$'
  const a = Math.abs(n), sig = n < 0 ? '-' : ''
  if (a >= 1e6) return `${sig}${s} ${(a / 1e6).toFixed(1).replace('.', ',')}M`
  if (a >= 1e4) return `${sig}${s} ${(a / 1e3).toFixed(1).replace('.', ',')}k`
  return `${sig}${s} ${a.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

/** Valor completo: R$ 1.234,56 */
export function moneyFull(v, moeda = 'BRL') {
  const n = parseFloat(v) || 0
  const s = SIM[moeda] || 'R$'
  return `${s} ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function num(v) {
  const n = Math.round(parseFloat(v) || 0)
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace('.', ',')}M`
  if (n >= 1e4) return `${(n / 1e3).toFixed(1).replace('.', ',')}k`
  return n.toLocaleString('pt-BR')
}

export const numFull = v => Math.round(parseFloat(v) || 0).toLocaleString('pt-BR')
export const pct = (v, d = 2) => `${(parseFloat(v) || 0).toFixed(d).replace('.', ',')}%`
export const roasFmt = v => `${(parseFloat(v) || 0).toFixed(2).replace('.', ',')}x`

// ══ DELTA ═══════════════════════════════════════════════════
export function deltaPct(atual, anterior) {
  if (anterior === null || anterior === undefined || anterior === 0) return null
  return ((atual - anterior) / Math.abs(anterior)) * 100
}

// ══ DATAS ═══════════════════════════════════════════════════
export const iso = d => d.toISOString().split('T')[0]

export function periodoAnterior(de, ate) {
  const f = new Date(de), t = new Date(ate)
  const dias = Math.round((t - f) / 86400000) + 1
  const pf = new Date(f); pf.setDate(pf.getDate() - dias)
  const pt = new Date(f); pt.setDate(pt.getDate() - 1)
  return { de: iso(pf), ate: iso(pt) }
}

export function presetDatas(preset) {
  const hoje = new Date()
  const a = hoje.getFullYear(), m = hoje.getMonth()
  let de, ate = new Date(hoje)
  switch (preset) {
    case 'hoje':        de = new Date(hoje); break
    case '7d':          de = new Date(hoje); de.setDate(de.getDate() - 6); break
    case '30d':         de = new Date(hoje); de.setDate(de.getDate() - 29); break
    case 'este-mes':    de = new Date(a, m, 1); break
    case 'mes-passado': de = new Date(a, m - 1, 1); ate = new Date(a, m, 0); break
    default:            de = new Date(hoje); de.setDate(de.getDate() - 29)
  }
  return { de: iso(de), ate: iso(ate) }
}

export const nomeMes = dataStr =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(dataStr + 'T12:00:00')).toLowerCase()

export function rotuloPeriodo(de, ate) {
  const o = { day: '2-digit', month: 'short' }
  const f = new Date(de + 'T12:00:00').toLocaleDateString('pt-BR', o)
  const t = new Date(ate + 'T12:00:00').toLocaleDateString('pt-BR', o)
  return `${f} – ${t}`
}
