import Papa from 'papaparse'
import { iso, leadReal, msgReal } from './format'

const normId = (id) => String(id).replace(/-/g, '')
const num = (v) => parseFloat(v || 0)

async function apiData(params) {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`/api/data?${qs}`)
    if (!res.ok) return { data: [] }
    return await res.json()
  } catch {
    return { data: [] }
  }
}

const LEADF = 'actions_lead,actions_leadgen_grouped,actions_onsite_conversion_lead_grouped,actions_offsite_conversion_fb_pixel_lead,actions_complete_registration'
const MSGF = 'actions_onsite_conversion_messaging_conversation_started_7d,actions_onsite_conversion_total_messaging_connection'

// Parser de número brasileiro/planilha (R$ 1.234,56 -> 1234.56)
function parseBR(v) {
  if (!v && v !== 0) return 0
  const s = String(v).replace(/R\$\s*/g, '').replace(/\s/g, '').trim()
  if (!s || s === '-') return 0
  if (/^\d{1,3}(\.\d{3})*(,\d*)?$/.test(s)) return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0
  return parseFloat(s.replace(',', '.')) || 0
}

function loadCsv(url) {
  return new Promise((resolve) => {
    Papa.parse(url, {
      download: true, header: false, skipEmptyLines: true,
      complete: (res) => resolve(res.data || []),
      error: () => resolve([]),
    })
  })
}

// Carrega a planilha financeira principal (mesmo layout do HTML antigo)
async function loadFinanceSheet(sheet, dateTo) {
  const fin = { fat: 0, v: 0, ticket: 0, gFat: 0, gV: 0, gTicket: 0, fatMsg: 0, vMsg: 0, ticketMsg: 0, fatTray: 0, vTray: 0, ticketTray: 0, fatTotal: 0, vTotal: 0 }
  if (!sheet) return fin
  const rows = await loadCsv(sheet)
  const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(dateTo)).toLowerCase()
  const p = parseBR, pi = (v) => Math.round(parseBR(v))
  rows.forEach((row) => {
    const colA = String(row[0] || '').toLowerCase().trim()
    if (!colA.includes(mes)) return
    fin.gFat = p(row[1]); const metaFat = p(row[2]); fin.fatMsg = p(row[3]); fin.fatTotal = p(row[5])
    const tktGeral = p(row[6]); fin.gV = pi(row[7]); const metaV = pi(row[8]); fin.vMsg = pi(row[9]); fin.vTotal = pi(row[11])
    fin.fatTray = fin.gFat + metaFat; fin.vTray = fin.gV + metaV
    if (!fin.fatTotal) fin.fatTotal = fin.fatTray + fin.fatMsg
    if (!fin.vTotal) fin.vTotal = fin.vTray + fin.vMsg
    fin.fat = fin.fatTotal; fin.v = fin.vTotal
    fin.ticket = tktGeral > 0 ? tktGeral : (fin.v > 0 ? fin.fat / fin.v : 0)
    fin.ticketTray = fin.vTray > 0 ? fin.fatTray / fin.vTray : 0
    fin.ticketMsg = fin.vMsg > 0 ? fin.fatMsg / fin.vMsg : 0
    fin.gTicket = fin.gV > 0 ? fin.gFat / fin.gV : 0
  })
  return fin
}

// Carrega a fonte de fundo de funil (Kommo/Shopify/Tray) por CSV
async function loadFunilSource(C, dateTo) {
  if (!C.funilSheet) return {}
  const rows = await loadCsv(C.funilSheet)
  const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(dateTo)).toLowerCase()
  const p = parseBR
  let out = {}
  rows.forEach((row) => {
    const colA = String(row[0] || '').toLowerCase().trim()
    if (!colA.includes(mes)) return
    // Kommo:   A=mês | B=MQL | C=SQL | D=SQO | E=Vendas | F=Receita
    // Shopify/Tray: A=mês | B=Carrinho | C=Vendas | D=Receita
    if (C.funilSource === 'kommo') out = { mql: p(row[1]), sql: p(row[2]), sqo: p(row[3]), vendas: p(row[4]), receita: p(row[5]) }
    else out = { carrinho: p(row[1]), vendas: p(row[2]), receita: p(row[3]) }
  })
  return out
}

// Fetch principal — devolve todo o state de dados para o cliente e período
export async function fetchAll(C, dateFrom, dateTo) {
  const days = Math.round((new Date(dateTo) - new Date(dateFrom)) / 86400000) + 1
  const pf = new Date(dateFrom); pf.setDate(pf.getDate() - days)
  const pt = new Date(dateFrom); pt.setDate(pt.getDate() - 1)
  const pfStr = iso(pf), ptStr = iso(pt)

  const [mJ, mPJ, gJ, gPJ, ttJ, geoJ, fin, funilSrc] = await Promise.all([
    apiData({ date_from: dateFrom, date_to: dateTo, fields: `source,account_id,campaign,spend,impressions,clicks,ctr,cpc,actions_omni_purchase,action_values_omni_purchase,${MSGF},${LEADF},objective` }),
    apiData({ date_from: pfStr, date_to: ptStr, fields: `source,account_id,spend,actions_omni_purchase,action_values_omni_purchase,${MSGF},${LEADF},conversions` }),
    apiData({ date_from: dateFrom, date_to: dateTo, fields: 'source,account_id,campaign,spend,impressions,clicks,ctr,cpc,conversions,cost_per_conversion' }),
    apiData({ date_from: pfStr, date_to: ptStr, fields: 'source,account_id,spend,conversions' }),
    (C.tiktokIds && C.tiktokIds.length) ? apiData({ date_from: dateFrom, date_to: dateTo, fields: 'source,account_id,campaign,spend,impressions,clicks,ctr,cpc,conversions' }) : Promise.resolve({ data: [] }),
    apiData({ date_from: dateFrom, date_to: dateTo, fields: 'source,account_id,region,clicks,impressions,spend' }),
    loadFinanceSheet(C.sheet, dateTo),
    loadFunilSource(C, dateTo),
  ])

  const inMeta = (r) => C.metaIds.map(normId).includes(normId(r.account_id))
  const inGoogle = (r) => C.googleIds.map(normId).includes(normId(r.account_id))
  const inTk = (r) => C.tiktokIds.map(normId).includes(normId(r.account_id))

  const meta = (mJ.data || []).filter(inMeta)
  const google = (gJ.data || []).filter(inGoogle)
  const tiktok = (C.tiktokIds && C.tiktokIds.length) ? (ttJ.data || []).filter(inTk) : []
  const geo = (geoJ.data || []).filter((r) => inMeta(r) && r.region && r.region !== 'Unknown')

  const mPrev = (mPJ.data || []).filter(inMeta)
  const gPrev = (gPJ.data || []).filter(inGoogle)
  const prev = {
    mSp: mPrev.reduce((a, r) => a + num(r.spend), 0),
    gSp: gPrev.reduce((a, r) => a + num(r.spend), 0),
    rev: mPrev.reduce((a, r) => a + num(r.action_values_omni_purchase), 0),
    v: mPrev.reduce((a, r) => a + num(r.actions_omni_purchase), 0),
    wpp: mPrev.reduce((a, r) => a + msgReal(r), 0),
    leads: mPrev.reduce((a, r) => a + leadReal(r), 0),
    conv: gPrev.reduce((a, r) => a + num(r.conversions), 0),
  }

  // Se não há planilha, estima "vendas" (resultados) pela soma de wpp+leads
  if (!C.sheet) {
    const w = meta.reduce((a, r) => a + msgReal(r), 0)
    const l = meta.reduce((a, r) => a + leadReal(r), 0)
    fin.v = Math.round(w + l)
  }

  return { meta, google, tiktok, geo, prev, fin, funilSrc }
}

// Fetch de demografia (breakdown age/gender) — separado
export async function fetchDemographics(C, dateFrom, dateTo) {
  const j = await apiData({ date_from: dateFrom, date_to: dateTo, fields: 'account_id,age,gender,impressions,clicks,reach', breakdowns: 'age,gender' })
  return (j.data || []).filter((r) => C.metaIds.map(normId).includes(normId(r.account_id)) && r.age && r.gender)
}

// Fetch de anúncios individuais — separado (pesado)
export async function fetchAds(C, dateFrom, dateTo) {
  const j = await apiData({ date_from: dateFrom, date_to: dateTo, fields: `source,account_id,campaign,ad_name,ad_id,ad_status,ad_effective_status,thumbnail_url,creative_url,spend,impressions,clicks,ctr,cpc,actions_omni_purchase,action_values_omni_purchase,${MSGF},${LEADF}` })
  return (j.data || []).filter((r) => C.metaIds.map(normId).includes(normId(r.account_id)) && (r.ad_name || r.ad_id))
}
