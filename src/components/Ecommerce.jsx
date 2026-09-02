import React from 'react'
import { Kpi, Grid, Bloco } from './ui'
import Funil from './Funil'
import { LinhasInvestimentoReceita, BarrasRoas } from './GraficoLinhas'
import { InvestimentoPorOrigem, SerieTemporal, BlocosCampanhas } from './GraficosLaterais'
import CriativosView from './CriativosView'
import { money, num, roasFmt, pct, deltaPct } from '../lib/format'
import {
  IcInvest, IcReceita, IcRoas, IcTicket, IcCpa,
  IcEcommerce, IcMensagem, canalIcone,
} from '../icons'

export default function Ecommerce({ metricas: m, criativos, cliente, carregando, carregandoCriativos }) {
  const { moeda } = cliente
  const d = (a, b) => deltaPct(a, b)

  const porCanal = m.canais.map(c => ({
    canal: c.nome, investimento: c.custo, receita: c.receita, roas: c.roas,
  }))

  const etapas = [
    { rotulo: 'Impressões', valor: m.impressoes, dica: 'Exibições dos anúncios em todos os canais.' },
    { rotulo: 'Cliques', valor: m.cliques, dica: 'Cliques que levaram tráfego à loja.' },
    ...(m.wpp > 0 ? [{ rotulo: 'Conversas', valor: m.wpp, origem: 'WhatsApp',
      dica: 'Conversas iniciadas pelas campanhas de mensagem.' }] : []),
    { rotulo: 'Vendas', valor: m.vendas, custo: m.custo, origem: m.origemVendas,
      dica: 'Pedidos confirmados na plataforma de e-commerce.' },
  ]

  return (
    <>
      {/* ══ KPIs EXECUTIVOS ══ */}
      <Grid cols={5} className="mb-5">
        <Kpi carregando={carregando} icone={IcInvest} rotulo="Custo total"
          valor={money(m.custo, moeda)} sub={`${m.campanhas.length} campanhas`}
          delta={d(m.custo, m.ant.custo)} cor="var(--graphite)"
          dica="Investimento total em mídia paga somando todos os canais." />
        <Kpi carregando={carregando} icone={IcReceita} rotulo="Receita total"
          valor={money(m.receita, moeda)} sub={`${num(m.vendas)} vendas concluídas`}
          delta={d(m.receita, m.ant.receita)} cor="var(--red)"
          dica={`Receita confirmada na plataforma ${m.origemVendas || 'de e-commerce'}.`} />
        <Kpi carregando={carregando} icone={IcRoas} rotulo="ROAS geral"
          valor={m.roas > 0 ? roasFmt(m.roas) : '—'} sub="Receita ÷ Custo"
          delta={d(m.roas, m.ant.roas)} cor="var(--red)"
          dica="Retorno sobre o investimento. 3x significa que cada R$1 investido gerou R$3 de receita." />
        <Kpi carregando={carregando} icone={IcCpa} rotulo="CPA médio"
          valor={m.cpa > 0 ? money(m.cpa, moeda) : '—'} sub="Custo por venda"
          delta={d(m.cpa, m.ant.cpa)} inverterDelta cor="var(--red-2)"
          dica="Quanto custou, em média, conquistar cada venda. Menor é melhor." />
        <Kpi carregando={carregando} icone={IcTicket} rotulo="Ticket médio"
          valor={m.ticket > 0 ? money(m.ticket, moeda) : '—'} sub={`${num(m.vendas)} pedidos`}
          delta={d(m.ticket, m.ant.ticket)} cor="var(--graphite)"
          dica="Valor médio de cada pedido no período." />
      </Grid>

      {/* ══ FUNIL + LATERAIS ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 mb-5">
        <Funil etapas={etapas} moeda={moeda}
          titulo="Funil de conversão"
          sub={`Da exibição do anúncio até a venda confirmada${m.origemVendas ? ` na ${m.origemVendas}` : ''}`}
          altura={64} />

        <div className="space-y-3">
          <InvestimentoPorOrigem dados={porCanal} moeda={moeda} altura={112} />
          <SerieTemporal dados={m.serie} moeda={moeda} altura={112}
            titulo="Investimento × Receita" sub="Evolução diária"
            chaves={[
              { chave: 'custo', rotulo: 'Investimento' },
              { chave: 'receita', rotulo: 'Receita' },
            ]} />
          <SerieTemporal dados={m.serie} moeda={moeda} altura={112}
            titulo="Custo por aquisição" sub="CPA diário"
            chaves={[{ chave: 'cpa', rotulo: 'CPA' }]} />
        </div>
      </div>

      {/* ══ ROAS POR CANAL ══ */}
      <Bloco titulo="Desempenho por canal" icone={IcEcommerce}>
        <Grid cols={m.canais.length > 3 ? 4 : 3}>
          {m.canais.map(c => {
            const Ic = canalIcone(c.chave)
            const cor = c.roas >= 3 ? 'var(--green)' : c.roas >= 1 ? 'var(--amber)' : 'var(--red)'
            return (
              <Kpi key={c.chave} carregando={carregando} icone={Ic}
                rotulo={`ROAS ${c.nome}`}
                valor={c.roas > 0 ? roasFmt(c.roas) : '—'}
                sub={`${money(c.custo, moeda)} investido · ${money(c.receita, moeda)} receita`}
                cor={cor}
                dica={`Retorno do ${c.nome}: receita atribuída dividida pelo investimento no canal.`} />
            )
          })}
          {m.wpp > 0 && (
            <Kpi carregando={carregando} icone={IcMensagem} rotulo="Conversas iniciadas"
              valor={num(m.wpp)}
              sub={m.custoMsg > 0 ? `${money(m.custoMsg / Math.max(m.wpp, 1), moeda)} por conversa` : ''}
              cor="var(--graphite)"
              dica="Conversas de WhatsApp geradas pelas campanhas de mensagem." />
          )}
        </Grid>
      </Bloco>

      {/* ══ GRÁFICOS COMPARATIVOS ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <LinhasInvestimentoReceita dados={porCanal} moeda={moeda}
          titulo="Investimento × Receita por canal"
          sub="Onde o dinheiro entra e sai" altura={210} />
        <BarrasRoas dados={porCanal}
          titulo="ROAS por canal"
          sub="Verde ≥ 3x · Âmbar ≥ 1x · Vermelho < 1x" altura={210} />
      </div>

      {/* ══ CAMPANHAS ══ */}
      {m.campanhas.length > 0 && (
        <div className="mb-5">
          <BlocosCampanhas campanhas={m.campanhas} moeda={moeda} />
        </div>
      )}

      {/* ══ CRIATIVOS ══ */}
      <Bloco titulo="Criativos ativos">
        <CriativosView criativos={criativos} moeda={moeda} ecommerce
          carregando={carregandoCriativos} />
      </Bloco>
    </>
  )
}
