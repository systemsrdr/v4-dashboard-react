import React from 'react'
import { Kpi, Grid, Bloco } from './ui'
import Funil from './Funil'
import { InvestimentoPorOrigem, SerieTemporal, BlocosCampanhas } from './GraficosLaterais'
import TabelaCriativos from './TabelaCriativos'
import { money, num, pct, deltaPct } from '../lib/format'
import {
  IcReceita, IcInvest, IcCpa, IcTicket, IcRoas,
  IcImpressao, IcClique, IcLead, IcVendas, IcKommo, IcInsideSales,
} from '../icons'

export default function InsideSales({ metricas: m, criativos, cliente, carregando, carregandoCriativos }) {
  const { moeda } = cliente
  const d = (a, b) => deltaPct(a, b)

  const etapas = [
    { rotulo: 'Impressões', valor: m.impressoes,
      dica: 'Quantas vezes os anúncios foram exibidos.' },
    { rotulo: 'Cliques', valor: m.cliques,
      dica: 'Pessoas que clicaram nos anúncios.' },
    { rotulo: 'MQPL', valor: m.mqpl, custo: m.custo, origem: 'Mídia',
      dica: 'Leads qualificados de marketing: formulários e conversas geradas pela mídia paga.' },
    { rotulo: 'SQL', valor: m.sql, origem: 'Kommo',
      dica: 'Leads qualificados por vendas, confirmados no Kommo CRM.' },
    { rotulo: 'Vendas fechadas', valor: m.vendas, origem: 'Kommo',
      dica: 'Negócios ganhos registrados no CRM.' },
  ]

  const porCanal = m.canais.map(c => ({ canal: c.nome, investimento: c.custo }))

  return (
    <>
      {/* ══ KPIs EXECUTIVOS ══ */}
      <Grid cols={5} className="mb-5">
        <Kpi carregando={carregando} icone={IcReceita} rotulo="Receita total"
          valor={money(m.receita, moeda)} sub={m.vendas > 0 ? `${num(m.vendas)} contratos` : 'Aguardando CRM'}
          delta={d(m.receita, m.ant.receita)} cor="var(--red)"
          dica="Receita dos negócios fechados no período, vinda do Kommo CRM." />
        <Kpi carregando={carregando} icone={IcInvest} rotulo="Investimento em anúncios"
          valor={money(m.custo, moeda)} sub={`${m.campanhas.length} campanhas ativas`}
          delta={d(m.custo, m.ant.custo)} cor="var(--graphite)"
          dica="Total investido em mídia paga somando todos os canais conectados." />
        <Kpi carregando={carregando} icone={IcCpa} rotulo="Custo por SQL"
          valor={m.custoSql > 0 ? money(m.custoSql, moeda) : '—'}
          sub={m.sql > 0 ? `${num(m.sql)} oportunidades` : 'Conectar Kommo'}
          inverterDelta cor="var(--red-2)"
          dica="Investimento total dividido pelos leads qualificados por vendas. Menor é melhor." />
        <Kpi carregando={carregando} icone={IcTicket} rotulo="Valor médio do contrato"
          valor={m.ticket > 0 ? money(m.ticket, moeda) : '—'}
          sub={m.vendas > 0 ? `${num(m.vendas)} contratos` : 'Aguardando CRM'}
          delta={d(m.ticket, m.ant.ticket)} cor="var(--graphite)"
          dica="Receita dividida pelo número de contratos fechados." />
        <Kpi carregando={carregando} icone={IcRoas} rotulo="ROI"
          valor={m.roas > 0 ? `${(m.roas * 100).toFixed(0)}%` : '—'}
          sub="Retorno sobre investimento"
          delta={d(m.roas, m.ant.roas)} cor="var(--red)"
          dica="Receita gerada dividida pelo investimento em anúncios, expressa em percentual." />
      </Grid>

      {/* ══ FUNIL CENTRAL + LATERAIS ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 mb-5">
        <Funil etapas={etapas} moeda={moeda}
          titulo="Funil de vendas: impressões até SQL"
          sub={m.sql > 0 ? 'Integrado ao Kommo CRM' : 'Etapas de CRM aguardando conexão com o Kommo'}
          altura={64} />

        <div className="space-y-3">
          <InvestimentoPorOrigem dados={porCanal} moeda={moeda} altura={112} />
          <SerieTemporal dados={m.serie} moeda={moeda} altura={112}
            titulo="Taxa de conversão MQPL" sub="Cliques que viraram lead" formato="pct"
            chaves={[{ chave: 'taxaLead', rotulo: 'Conversão' }]} />
          <SerieTemporal dados={m.serie} moeda={moeda} altura={112}
            titulo="Custo por lead (CPL)" sub="Evolução diária"
            chaves={[{ chave: 'cpl', rotulo: 'CPL' }]} />
        </div>
      </div>

      {/* ══ MÉTRICAS DE MÍDIA ══ */}
      <Bloco titulo="Performance de mídia" icone={IcInsideSales}>
        <Grid cols={5}>
          <Kpi carregando={carregando} icone={IcImpressao} rotulo="Impressões"
            valor={num(m.impressoes)} sub={`CTR ${pct(m.ctr)}`}
            delta={d(m.impressoes, m.ant.impressoes)} cor="var(--graphite)"
            dica="Exibições dos anúncios no período." />
          <Kpi carregando={carregando} icone={IcClique} rotulo="Cliques"
            valor={num(m.cliques)} sub={`CPC ${money(m.cpc, moeda)}`}
            delta={d(m.cliques, m.ant.cliques)} cor="var(--amber)"
            dica="Cliques recebidos nos anúncios." />
          <Kpi carregando={carregando} icone={IcLead} rotulo="MQPL"
            valor={num(m.mqpl)} sub={`${num(m.leads)} formulários · ${num(m.wpp)} conversas`}
            delta={d(m.mqpl, m.ant.mqpl)} cor="var(--green)"
            dica="Leads qualificados de marketing capturados diretamente na mídia paga." />
          <Kpi carregando={carregando} icone={IcCpa} rotulo="CPL"
            valor={m.cpl > 0 ? money(m.cpl, moeda) : '—'} sub="Custo por lead"
            delta={d(m.cpl, m.ant.cpl)} inverterDelta cor="var(--red-2)"
            dica="Investimento dividido pelo número de MQPL." />
          <Kpi carregando={carregando} icone={IcVendas} rotulo="SQL"
            valor={m.sql > 0 ? num(m.sql) : '—'}
            sub={m.sql > 0 ? `${pct(m.taxaMqplSql)} de aproveitamento` : 'Conectar Kommo'}
            cor="var(--red)"
            dica="Leads qualificados por vendas no Kommo CRM." />
        </Grid>
      </Bloco>

      {/* ══ CAMPANHAS ══ */}
      {m.campanhas.length > 0 && (
        <div className="mb-5">
          <BlocosCampanhas campanhas={m.campanhas} moeda={moeda} />
        </div>
      )}

      {/* ══ CRIATIVOS ══ */}
      <Bloco titulo="Criativos ativos">
        <TabelaCriativos criativos={criativos} moeda={moeda} ecommerce={false}
          carregando={carregandoCriativos} />
      </Bloco>
    </>
  )
}
