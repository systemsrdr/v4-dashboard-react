import React, { useState, useEffect, useMemo } from 'react'
import { ThemeProvider } from './hooks/useTheme'
import { getClient } from './lib/clients'
import {
  buscarDados, buscarCriativos, agruparCampanhas, totais,
  lerFinanceiro, lerFunil,
} from './lib/api'
import { presetDatas, periodoAnterior, rotuloPeriodo } from './lib/format'

import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import VisaoGeral from './components/VisaoGeral'
import Ecommerce from './components/Ecommerce'
import InsideSales from './components/InsideSales'
import Conectores from './components/Conectores'
import Configuracoes from './components/Configuracoes'
import Plataforma from './components/Plataforma'
import Shopify from './components/Shopify'
import CriativosView from './components/CriativosView'

const TITULOS = {
  'visao-geral':  ['Visão Geral', 'Resultado consolidado de todos os canais'],
  'meta':         ['Meta Ads', 'Investimento e resultados da Meta (Facebook e Instagram)'],
  'google':       ['Google Ads', 'Investimento e resultados do Google'],
  'tiktok':       ['TikTok Ads', 'Investimento e resultados do TikTok'],
  'shopify':      ['Shopify', 'Vendas e receita da loja Shopify'],
  'anuncios':     ['Anúncios', 'Desempenho individual de cada criativo'],
  'ecommerce':    ['E-commerce', 'Mídia paga e vendas da loja virtual'],
  'inside-sales': ['Inside Sales', 'Geração de leads e qualificação no CRM'],
  'conectores':   ['Conectores de Dados', 'Integrações ativas e cache'],
  'config':       ['Configurações', 'Preferências do painel'],
}

/* ══ SESSÃO ══ */
function useSessao() {
  const [sessao, setSessao] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('v4-sessao') || sessionStorage.getItem('v4-sessao') || 'null')
    } catch { return null }
  })
  const entrar = s => {
    ;(s.manter ? localStorage : sessionStorage).setItem('v4-sessao', JSON.stringify(s))
    setSessao(s)
  }
  const sair = () => {
    localStorage.removeItem('v4-sessao'); sessionStorage.removeItem('v4-sessao')
    setSessao(null)
  }
  const trocarCliente = slug => {
    const s = { ...sessao, slug }
    const alvo = localStorage.getItem('v4-sessao') ? localStorage : sessionStorage
    alvo.setItem('v4-sessao', JSON.stringify(s))
    setSessao(s)
  }
  return { sessao, entrar, sair, trocarCliente }
}

export default function App() {
  const { sessao, entrar, sair, trocarCliente } = useSessao()
  const [secao, setSecao] = useState('visao-geral')
  const [recolhida, setRecolhida] = useState(false)
  const [periodo, setPeriodo] = useState(() => ({ ...presetDatas('este-mes'), preset: 'este-mes' }))

  const [bruto, setBruto] = useState(null)
  const [financeiro, setFinanceiro] = useState(null)
  const [funilCrm, setFunilCrm] = useState(null)
  const [criativos, setCriativos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoCriativos, setCarregandoCriativos] = useState(true)

  const cliente = sessao ? getClient(sessao.slug) : null

  /* ── carga dos KPIs (rápida) ── */
  useEffect(() => {
    if (!cliente) return
    let cancelado = false
    setCarregando(true); setBruto(null); setFinanceiro(null); setFunilCrm(null)

    const ant = periodoAnterior(periodo.de, periodo.ate)

    buscarDados(cliente, periodo.de, periodo.ate, ant.de, ant.ate)
      .then(d => { if (!cancelado) { setBruto(d); setCarregando(false) } })
      .catch(() => { if (!cancelado) setCarregando(false) })

    lerFinanceiro(cliente.sheet, periodo.ate).then(f => { if (!cancelado) setFinanceiro(f) })
    lerFunil(cliente.funilSheet, cliente.vendaSource, periodo.ate).then(f => { if (!cancelado) setFunilCrm(f) })

    return () => { cancelado = true }
  }, [cliente?.slug, periodo.de, periodo.ate]) // eslint-disable-line

  /* ── criativos (lazy) ── */
  useEffect(() => {
    if (!cliente) return
    let cancelado = false
    setCarregandoCriativos(true); setCriativos([])
    const t = setTimeout(() => {
      buscarCriativos(cliente, periodo.de, periodo.ate)
        .then(c => { if (!cancelado) { setCriativos(c); setCarregandoCriativos(false) } })
        .catch(() => { if (!cancelado) setCarregandoCriativos(false) })
    }, 150)
    return () => { cancelado = true; clearTimeout(t) }
  }, [cliente?.slug, periodo.de, periodo.ate]) // eslint-disable-line

  const metricas = useMemo(
    () => (bruto && cliente ? calcular(bruto, financeiro, funilCrm, cliente) : vazio()),
    [bruto, financeiro, funilCrm, cliente]
  )

  if (!sessao || !cliente) return <ThemeProvider><Login onEntrar={entrar} /></ThemeProvider>

  const largura = recolhida ? 60 : 200
  const [titulo, subtitulo] = TITULOS[secao] || TITULOS['visao-geral']
  const props = { metricas, criativos, cliente, carregando, carregandoCriativos }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--deep)]">
        <Sidebar
          secao={secao} onSecao={setSecao}
          cliente={cliente} onCliente={trocarCliente} onSair={sair}
          recolhida={recolhida} onRecolher={() => setRecolhida(r => !r)}
        />
        <Header
          periodo={periodo} onPeriodo={setPeriodo}
          cliente={cliente} carregando={carregando} larguraSidebar={largura}
        />

        <main className="transition-[padding] duration-200" style={{ paddingLeft: largura, paddingTop: 58 }}>
          <div className="p-6 max-w-[1680px]">
            <div className="mb-6 fade-up">
              <div className="text-[10px] text-[var(--tx3)] mb-1.5 uppercase tracking-wider">
                {cliente.nome} · {rotuloPeriodo(periodo.de, periodo.ate)}
              </div>
              <h1 className="text-[26px] font-extrabold text-[var(--tx)] tracking-tight leading-none">{titulo}</h1>
              <p className="text-[12px] text-[var(--tx2)] mt-1.5">{subtitulo}</p>
            </div>

            {secao === 'visao-geral'  && <VisaoGeral {...props} />}
            {(secao === 'meta' || secao === 'google' || secao === 'tiktok') &&
              <Plataforma canal={secao} {...props} />}
            {secao === 'shopify'      && <Shopify cliente={cliente} />}
            {secao === 'anuncios'     && (
              <CriativosView criativos={criativos} moeda={cliente.moeda}
                ecommerce={cliente.tipo === 'ecommerce'} carregando={carregandoCriativos} />
            )}
            {secao === 'ecommerce'    && <Ecommerce {...props} />}
            {secao === 'inside-sales' && <InsideSales {...props} />}
            {secao === 'conectores'   && <Conectores cliente={cliente} metricas={metricas} />}
            {secao === 'config'       && <Configuracoes cliente={cliente} />}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

/* ══════════════════════════════════════════════════════
   CÁLCULO DE MÉTRICAS
   ══════════════════════════════════════════════════════ */
function calcular(bruto, fin, crm, cliente) {
  const { atual, anterior } = bruto
  const ecommerce = cliente.tipo === 'ecommerce'

  const campanhas = [
    ...agruparCampanhas(atual.meta, 'meta'),
    ...agruparCampanhas(atual.google, 'google'),
    ...agruparCampanhas(atual.tiktok, 'tiktok'),
  ].sort((a, b) => b.custo - a.custo)

  const tM = totais(atual.meta),   tG = totais(atual.google),   tT = totais(atual.tiktok)
  const aM = totais(anterior.meta), aG = totais(anterior.google), aT = totais(anterior.tiktok)

  const custo    = tM.custo + tG.custo + tT.custo
  const custoAnt = aM.custo + aG.custo + aT.custo
  const impressoes = tM.impressoes + tG.impressoes + tT.impressoes
  const impAnt     = aM.impressoes + aG.impressoes + aT.impressoes
  const cliques    = tM.cliques + tG.cliques + tT.cliques
  const clkAnt     = aM.cliques + aG.cliques + aT.cliques

  const wpp   = tM.wpp
  const leads = tM.leads + tG.leads + tT.leads
  const mqpl  = leads + wpp
  const mqplAnt = aM.leads + aG.leads + aT.leads + aM.wpp

  /* receita/vendas: planilha e CRM têm prioridade sobre a API */
  const receitaApi = tM.receita + tG.receita + tT.receita
  const vendasApi  = tM.compras + tG.conversoes + tT.conversoes

  const receita = ecommerce
    ? (fin?.receitaTotal || receitaApi)
    : (crm?.receita || 0)
  const vendas = ecommerce
    ? (fin?.vendasTotal || vendasApi)
    : (crm?.vendas || 0)

  const receitaAnt = aM.receita + aG.receita + aT.receita
  const vendasAnt  = aM.compras + aG.conversoes + aT.conversoes

  /* canais */
  const canais = []
  const add = (chave, nome, t, rec, vd) => {
    if (t.custo <= 0) return
    const r = rec ?? t.receita
    canais.push({
      chave, nome, custo: t.custo, receita: r, vendas: vd ?? t.compras,
      leads: t.leads, wpp: t.wpp, impressoes: t.impressoes, cliques: t.cliques,
      roas: t.custo > 0 && r > 0 ? r / t.custo : 0,
    })
  }
  add('meta', 'Meta', tM,
    fin ? fin.metaReceita + fin.wppReceita : undefined,
    fin ? fin.metaVendas + fin.wppVendas : undefined)
  add('google', 'Google', tG, fin?.googleReceita, fin?.googleVendas)
  add('tiktok', 'TikTok', tT)

  const custoMsg = campanhas.filter(c => c.tipo === 'mensagem').reduce((a, c) => a + c.custo, 0)
  const sql = crm?.sql || 0

  const roas = custo > 0 && receita > 0 ? receita / custo : 0
  const roasAnt = custoAnt > 0 && receitaAnt > 0 ? receitaAnt / custoAnt : 0

  /* série temporal derivada das campanhas — aproximação por campanha
     enquanto a Windsor não devolve o campo `date` na chamada agregada */
  const serie = campanhas.slice(0, 12).map((c, i) => ({
    dia: c.campanha.slice(0, 10) || `#${i + 1}`,
    custo: Math.round(c.custo),
    receita: Math.round(c.receita),
    cpa: Math.round(c.cpa),
    cpl: c.leads + c.wpp > 0 ? Math.round(c.custo / (c.leads + c.wpp)) : 0,
    taxaLead: c.cliques > 0 ? +(((c.leads + c.wpp) / c.cliques) * 100).toFixed(1) : 0,
  }))

  const perfilPlat = t => {
    const vendas = (t.compras || 0) + (t.conversoes || 0)
    return {
      custo: t.custo, impressoes: t.impressoes, cliques: t.cliques,
      receita: t.receita, leads: t.leads, wpp: t.wpp, vendas,
      cpc: t.cliques > 0 ? t.custo / t.cliques : 0,
      ctr: t.impressoes > 0 ? (t.cliques / t.impressoes) * 100 : 0,
      roas: t.custo > 0 && t.receita > 0 ? t.receita / t.custo : 0,
      cpa: vendas > 0 ? t.custo / vendas : 0,
    }
  }

  return {
    custo, receita, vendas, impressoes, cliques, wpp, leads, mqpl,
    custoMsg, campanhas, canais, serie,
    plataformas: { meta: perfilPlat(tM), google: perfilPlat(tG), tiktok: perfilPlat(tT) },
    origemVendas: { shopify: 'Shopify', tray: 'Tray', kommo: 'Kommo' }[cliente.vendaSource],
    roas,
    ticket: (ecommerce ? fin?.ticketMedio : 0) || (vendas > 0 ? receita / vendas : 0),
    cpa: vendas > 0 ? custo / vendas : 0,
    cpl: mqpl > 0 ? custo / mqpl : 0,
    cpc: cliques > 0 ? custo / cliques : 0,
    ctr: impressoes > 0 ? (cliques / impressoes) * 100 : 0,
    sql,
    custoSql: sql > 0 ? custo / sql : 0,
    taxaMqplSql: mqpl > 0 && sql > 0 ? (sql / mqpl) * 100 : 0,
    taxaSqlVenda: sql > 0 && vendas > 0 ? (vendas / sql) * 100 : 0,
    ant: {
      custo: custoAnt, receita: receitaAnt, vendas: vendasAnt,
      impressoes: impAnt, cliques: clkAnt, mqpl: mqplAnt, roas: roasAnt,
      ticket: vendasAnt > 0 ? receitaAnt / vendasAnt : 0,
      cpa: vendasAnt > 0 ? custoAnt / vendasAnt : 0,
      cpl: mqplAnt > 0 ? custoAnt / mqplAnt : 0,
    },
  }
}

function vazio() {
  const z = { custo: 0, receita: 0, vendas: 0, impressoes: 0, cliques: 0, mqpl: 0, roas: 0, ticket: 0, cpa: 0, cpl: 0 }
  return {
    ...z, wpp: 0, leads: 0, custoMsg: 0, campanhas: [], canais: [], serie: [],
    sql: 0, custoSql: 0, taxaMqplSql: 0, taxaSqlVenda: 0, cpc: 0, ctr: 0,
    origemVendas: null, plataformas: {}, ant: z,
  }
}
