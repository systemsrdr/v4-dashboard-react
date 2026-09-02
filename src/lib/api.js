import Papa from 'papaparse'
import { nomeMes } from './format'

/* ══════════════════════════════════════════════════════════
   IMPORTANTE
   Todas as chamadas passam por /api/data (função serverless).
   Chamar connectors.windsor.ai direto do navegador é bloqueado
   por CORS e devolve vazio.
   ══════════════════════════════════════════════════════════ */
const API = '/api/data'

/* ── Campos de conversão do Meta (iguais ao dashboard validado) ── */
const CAMPOS_LEAD = [
  'actions_lead',
  'actions_leadgen_grouped',
  'actions_onsite_conversion_lead_grouped',
  'actions_offsite_conversion_fb_pixel_lead',
  'actions_complete_registration',
].join(',')

const CAMPOS_MSG = [
  'actions_onsite_conversion_messaging_conversation_started_7d',
  'actions_onsite_conversion_total_messaging_connection',
].join(',')

/** Soma todas as variações de lead que o Meta reporta */
export function leadReal(r) {
  return (+r.actions_lead || 0)
    + (+r.actions_leadgen_grouped || 0)
    + (+r.actions_onsite_conversion_lead_grouped || 0)
    + (+r.actions_offsite_conversion_fb_pixel_lead || 0)
    + (+r.actions_complete_registration || 0)
}

/** Soma todas as variações de conversa iniciada */
export function msgReal(r) {
  return (+r.actions_onsite_conversion_messaging_conversation_started_7d || 0)
    + (+r.actions_onsite_conversion_total_messaging_connection || 0)
}

/* ══════════════════════════════════════════════════════════
   CACHE — 15 minutos (memória + localStorage)
   ══════════════════════════════════════════════════════════ */
const TTL = 15 * 60 * 1000
const mem = new Map()

function ler(k) {
  const m = mem.get(k)
  if (m && Date.now() - m.ts < TTL) return m.dados
  try {
    const raw = localStorage.getItem('v4c:' + k)
    if (raw) {
      const { ts, dados } = JSON.parse(raw)
      if (Date.now() - ts < TTL) { mem.set(k, { ts, dados }); return dados }
      localStorage.removeItem('v4c:' + k)
    }
  } catch {}
  return null
}

function gravar(k, dados) {
  const ts = Date.now()
  mem.set(k, { ts, dados })
  try { localStorage.setItem('v4c:' + k, JSON.stringify({ ts, dados })) } catch {}
}

export function limparCache() {
  mem.clear()
  Object.keys(localStorage).filter(k => k.startsWith('v4c:')).forEach(k => localStorage.removeItem(k))
}

/* ══════════════════════════════════════════════════════════
   CHAMADA
   ══════════════════════════════════════════════════════════ */
async function buscar(campos, de, ate, breakdowns) {
  const p = new URLSearchParams({ date_from: de, date_to: ate, fields: campos })
  if (breakdowns) p.set('breakdowns', breakdowns)
  const url = `${API}?${p}`

  const cache = ler(url)
  if (cache) return cache

  try {
    const r = await fetch(url)
    const j = await r.json()
    const dados = j.data || []
    gravar(url, dados)
    return dados
  } catch (e) {
    console.warn('[V4] falha na chamada:', e.message)
    return []
  }
}

const norm = id => String(id ?? '').replace(/[-\s]/g, '').trim()

function daConta(linhas, ids) {
  if (!ids?.length) return []
  const alvo = ids.map(norm)
  return linhas.filter(l => alvo.includes(norm(l.account_id)))
}

/* ══════════════════════════════════════════════════════════
   BUSCA PRINCIPAL — tudo em paralelo
   ══════════════════════════════════════════════════════════ */
export async function buscarDados(cliente, de, ate, pDe, pAte) {
  const temMeta   = cliente.metaIds?.length > 0
  const temGoogle = cliente.googleIds?.length > 0
  const temTikTok = cliente.tiktokIds?.length > 0
  const nada = Promise.resolve([])

  const fMetaCamp = `source,account_id,campaign,spend,impressions,clicks,ctr,cpc,`
    + `actions_omni_purchase,action_values_omni_purchase,${CAMPOS_MSG},${CAMPOS_LEAD},objective`
  const fMetaAnt = `source,account_id,spend,impressions,clicks,`
    + `actions_omni_purchase,action_values_omni_purchase,${CAMPOS_MSG},${CAMPOS_LEAD}`
  const fGoogle    = 'source,account_id,campaign,spend,impressions,clicks,ctr,cpc,conversions,cost_per_conversion'
  const fGoogleAnt = 'source,account_id,spend,impressions,clicks,conversions'
  const fTikTok    = 'source,account_id,campaign,spend,impressions,clicks,ctr,cpc,conversions'
  const fGeo       = 'source,account_id,region,clicks,impressions,spend'

  const [mA, gA, tA, mP, gP, geo] = await Promise.all([
    temMeta   ? buscar(fMetaCamp,  de,  ate)  : nada,
    temGoogle ? buscar(fGoogle,    de,  ate)  : nada,
    temTikTok ? buscar(fTikTok,    de,  ate)  : nada,
    temMeta   ? buscar(fMetaAnt,   pDe, pAte) : nada,
    temGoogle ? buscar(fGoogleAnt, pDe, pAte) : nada,
    temMeta   ? buscar(fGeo,       de,  ate)  : nada,
  ])

  const res = {
    atual: {
      meta:   daConta(mA, cliente.metaIds),
      google: daConta(gA, cliente.googleIds),
      tiktok: daConta(tA, cliente.tiktokIds),
    },
    anterior: {
      meta:   daConta(mP, cliente.metaIds),
      google: daConta(gP, cliente.googleIds),
      tiktok: [],
    },
    geo: daConta(geo, cliente.metaIds).filter(r => r.region && r.region !== 'Unknown'),
  }

  console.info(
    `[V4] ${cliente.nome} · ${de} a ${ate} · ` +
    `Meta ${res.atual.meta.length} · Google ${res.atual.google.length} · TikTok ${res.atual.tiktok.length}`
  )
  return res
}

/* ══════════════════════════════════════════════════════════
   CRIATIVOS
   ══════════════════════════════════════════════════════════ */
export async function buscarCriativos(cliente, de, ate) {
  if (!cliente.metaIds?.length) return []
  const campos = `source,account_id,campaign,ad_name,ad_id,ad_status,ad_effective_status,`
    + `thumbnail_url,creative_url,spend,impressions,clicks,ctr,cpc,`
    + `actions_omni_purchase,action_values_omni_purchase,${CAMPOS_MSG},${CAMPOS_LEAD}`

  const raw = daConta(await buscar(campos, de, ate), cliente.metaIds)
    .filter(r => r.ad_name || r.ad_id)

  /* agrupa por anúncio (a API devolve uma linha por dia/posicionamento) */
  const mapa = {}
  raw.forEach(r => {
    const k = (r.ad_id || r.ad_name || '') + '|' + (r.campaign || '')
    if (!mapa[k]) mapa[k] = {
      id: r.ad_id || '', nome: r.ad_name || 'Sem nome', campanha: limparNome(r.campaign || ''),
      canal: 'meta', img: r.thumbnail_url || r.creative_url || null,
      status: String(r.ad_effective_status || r.ad_status || '').toUpperCase(),
      custo: 0, impressoes: 0, cliques: 0, compras: 0, receita: 0, wpp: 0, leads: 0,
    }
    const a = mapa[k]
    a.custo      += +r.spend || 0
    a.impressoes += +r.impressions || 0
    a.cliques    += +r.clicks || 0
    a.compras    += +r.actions_omni_purchase || 0
    a.receita    += +r.action_values_omni_purchase || 0
    a.wpp        += msgReal(r)
    a.leads      += leadReal(r)
    if (!a.img && (r.thumbnail_url || r.creative_url)) a.img = r.thumbnail_url || r.creative_url
  })

  return Object.values(mapa).map(a => {
    a.ctr = a.impressoes > 0 ? (a.cliques / a.impressoes) * 100 : 0
    a.cpc = a.cliques > 0 ? a.custo / a.cliques : 0
    a.conversoes = a.compras + a.wpp + a.leads
    a.cpa = a.conversoes > 0 ? a.custo / a.conversoes : 0
    a.roas = a.custo > 0 && a.receita > 0 ? a.receita / a.custo : 0
    if (a.status === 'ACTIVE') a.ativo = true
    else if (/PAUSED|ARCHIVED|DELETED|DISABLED|WITH_ISSUES|PENDING|IN_PROCESS/.test(a.status)) a.ativo = false
    else a.ativo = a.custo > 0
    return a
  }).filter(a => a.custo > 0)
}

/* ══════════════════════════════════════════════════════════
   AGREGAÇÃO
   ══════════════════════════════════════════════════════════ */
export const limparNome = s =>
  String(s || '')
    .replace(/[\u{1F7E0}-\u{1F7EB}]/gu, '')
    .replace(/\[V4RDR&Co\]/gi, '')
    .replace(/\[V4&Co\]/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Sem campanha'

export function agruparCampanhas(linhas, canal) {
  const mapa = {}
  linhas.forEach(r => {
    const k = r.campaign || 'Sem campanha'
    if (!mapa[k]) mapa[k] = {
      campanha: limparNome(k), canal, custo: 0, impressoes: 0, cliques: 0,
      compras: 0, receita: 0, wpp: 0, leads: 0, conversoes: 0, objetivo: r.objective || '',
    }
    const d = mapa[k]
    d.custo      += +r.spend || 0
    d.impressoes += +r.impressions || 0
    d.cliques    += +r.clicks || 0
    d.compras    += +r.actions_omni_purchase || 0
    d.receita    += +r.action_values_omni_purchase || 0
    d.wpp        += msgReal(r)
    d.leads      += leadReal(r)
    d.conversoes += +r.conversions || 0
  })
  return Object.values(mapa).map(d => {
    d.ctr  = d.impressoes > 0 ? (d.cliques / d.impressoes) * 100 : 0
    d.cpc  = d.cliques > 0 ? d.custo / d.cliques : 0
    d.roas = d.custo > 0 && d.receita > 0 ? d.receita / d.custo : 0
    const conv = d.compras || d.conversoes
    d.cpa  = conv > 0 ? d.custo / conv : 0
    d.tipo = tipoCampanha(d)
    return d
  }).sort((a, b) => b.custo - a.custo)
}

export function tipoCampanha(d) {
  const obj = String(d.objetivo || '').toUpperCase()
  const nm = String(d.campanha || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (obj.includes('LEADS') || /\blead\b|formulario|crm/.test(nm)) return 'lead'
  const ehMsg = d.wpp > 0 || /wpp|mensagem|msg|whatsapp/.test(nm) || obj.includes('MESSAGE')
  if (ehMsg && d.wpp >= d.compras) return 'mensagem'
  if (d.compras > 0 || obj.includes('SALES') || obj.includes('CONVERSION')) return 'compra'
  if (ehMsg) return 'mensagem'
  return 'trafego'
}

/** Totais brutos de um conjunto de linhas da API */
export function totais(linhas) {
  const s = c => linhas.reduce((a, r) => a + (+r[c] || 0), 0)
  return {
    custo: s('spend'),
    impressoes: s('impressions'),
    cliques: s('clicks'),
    compras: s('actions_omni_purchase'),
    receita: s('action_values_omni_purchase'),
    conversoes: s('conversions'),
    wpp: linhas.reduce((a, r) => a + msgReal(r), 0),
    leads: linhas.reduce((a, r) => a + leadReal(r), 0),
  }
}

/* ══════════════════════════════════════════════════════════
   PLANILHA FINANCEIRA — leitura por POSIÇÃO de coluna
   0 mês · 1 fatGoogle · 2 fatMeta · 3 receitaWPP
   5 GERAL · 6 TKT · 7 vdGoogle · 8 vdMeta · 9 vdWPP · 11 TOTAL
   ══════════════════════════════════════════════════════════ */
export function lerFinanceiro(url, ate) {
  if (!url) return Promise.resolve(null)
  const mes = nomeMes(ate)
  return new Promise(resolve => {
    Papa.parse(url, {
      download: true, header: false, skipEmptyLines: true,
      complete({ data }) {
        const p = v => {
          const s = String(v ?? '').replace(/R\$|€|\s/g, '').trim()
          if (!s || s === '-') return 0
          if (/^\d{1,3}(\.\d{3})*(,\d*)?$/.test(s)) return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0
          return parseFloat(s.replace(',', '.')) || 0
        }
        const pi = v => Math.round(p(v))
        let fin = null
        data.forEach(l => {
          if (!String(l[0] || '').toLowerCase().trim().includes(mes)) return
          const gFat = p(l[1]), mFat = p(l[2]), fatWpp = p(l[3])
          const geral = p(l[5]), tkt = p(l[6])
          const gV = pi(l[7]), mV = pi(l[8]), vWpp = pi(l[9]), vTot = pi(l[11])
          const fatLoja = gFat + mFat, vLoja = gV + mV
          const receitaTotal = geral || fatLoja + fatWpp
          const vendasTotal = vTot || vLoja + vWpp
          fin = {
            googleReceita: gFat, googleVendas: gV,
            metaReceita: mFat, metaVendas: mV,
            wppReceita: fatWpp, wppVendas: vWpp,
            lojaReceita: fatLoja, lojaVendas: vLoja,
            receitaTotal, vendasTotal,
            ticketMedio: tkt > 0 ? tkt : (vendasTotal > 0 ? receitaTotal / vendasTotal : 0),
            ticketGoogle: gV > 0 ? gFat / gV : 0,
            ticketMeta: mV > 0 ? mFat / mV : 0,
            ticketWpp: vWpp > 0 ? fatWpp / vWpp : 0,
          }
        })
        if (fin) console.info('[V4] Planilha financeira:', fin)
        resolve(fin)
      },
      error: () => resolve(null),
    })
  })
}

/* ══════════════════════════════════════════════════════════
   FUNIL DE FUNDO — Kommo / Shopify / Tray
   Kommo: mês | MQL | SQL | SQO | Vendas | Receita
   Loja:  mês | Carrinho | Vendas | Receita
   ══════════════════════════════════════════════════════════ */
export function lerFunil(url, origem, ate) {
  if (!url) return Promise.resolve(null)
  const mes = nomeMes(ate)
  return new Promise(resolve => {
    Papa.parse(url, {
      download: true, header: false, skipEmptyLines: true,
      complete({ data }) {
        const p = v => parseFloat(String(v ?? '').replace(/[R$€.\s]/g, '').replace(',', '.')) || 0
        const pi = v => Math.round(p(v))
        let out = null
        data.forEach(l => {
          if (!String(l[0] || '').toLowerCase().trim().includes(mes)) return
          out = origem === 'kommo'
            ? { mql: pi(l[1]), sql: pi(l[2]), sqo: pi(l[3]), vendas: pi(l[4]), receita: p(l[5]) }
            : { carrinho: pi(l[1]), vendas: pi(l[2]), receita: p(l[3]) }
        })
        resolve(out)
      },
      error: () => resolve(null),
    })
  })
}
