import React from 'react'
import { Kpi, Bloco, Card, Vazio } from './ui'
import { money, num, pct, roasFmt } from '../lib/format'
import {
  IcInvest, IcImpressao, IcClique, IcReceita, IcRoas, IcVendas, IcCpa,
  IcCriativos, canalIcone, canalNome,
} from '../icons'
import CriativosView from './CriativosView'

/* Página de uma plataforma (meta | google | tiktok) — só os dados desse canal */
export default function Plataforma({ canal, metricas: m, criativos, cliente, carregando, carregandoCriativos }) {
  const moeda = cliente.moeda
  const p = (m.plataformas && m.plataformas[canal]) ||
    { custo: 0, impressoes: 0, cliques: 0, receita: 0, vendas: 0, cpc: 0, ctr: 0, roas: 0, cpa: 0 }
  const camps = (m.campanhas || []).filter(c => c.canal === canal)
  const cris  = (criativos || []).filter(c => c.canal === canal)

  if (!carregando && p.custo <= 0 && camps.length === 0) {
    return <Vazio icone={canalIcone(canal)} titulo={`Sem dados de ${canalNome(canal)} no período`}
      descricao="Não há investimento registrado nesta plataforma para as datas selecionadas." />
  }

  return (
    <div className="space-y-5">
      {/* KPIs da plataforma */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi carregando={carregando} icone={IcInvest}    rotulo="Investimento" valor={money(p.custo, moeda)} cor="var(--red)" />
        <Kpi carregando={carregando} icone={IcImpressao} rotulo="Impressões"   valor={num(p.impressoes)} cor="var(--graphite)" />
        <Kpi carregando={carregando} icone={IcClique}    rotulo="Cliques"      valor={num(p.cliques)} sub={`CTR ${pct(p.ctr)}`} cor="var(--graphite)" />
        <Kpi carregando={carregando} icone={IcInvest}    rotulo="CPC"          valor={money(p.cpc, moeda)} cor="var(--graphite)" />
        <Kpi carregando={carregando} icone={IcReceita}   rotulo="Receita"      valor={money(p.receita, moeda)} cor="var(--green)" />
        <Kpi carregando={carregando} icone={IcRoas}      rotulo="ROAS"         valor={roasFmt(p.roas)} cor="var(--red)" />
        <Kpi carregando={carregando} icone={IcVendas}    rotulo="Conversões"   valor={num(p.vendas)} cor="var(--graphite)" />
        <Kpi carregando={carregando} icone={IcCpa}       rotulo="CPA"          valor={money(p.cpa, moeda)} cor="var(--graphite)" />
      </div>

      {/* Campanhas do canal */}
      <Bloco titulo={`Campanhas · ${canalNome(canal)}`}>
        {camps.length ? (
          <Card pad={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-[var(--tx-card3)] border-b border-[var(--card-line)]">
                    <th className="text-left  font-bold px-4 py-3">Campanha</th>
                    <th className="text-right font-bold px-3 py-3">Custo</th>
                    <th className="text-right font-bold px-3 py-3">Cliques</th>
                    <th className="text-right font-bold px-3 py-3">Receita</th>
                    <th className="text-right font-bold px-4 py-3">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {camps.map((c, i) => {
                    const roas = c.custo > 0 && c.receita > 0 ? c.receita / c.custo : 0
                    return (
                      <tr key={i} className="border-b border-[var(--card-line)] last:border-0 hover:bg-[var(--card-alt)] transition-colors">
                        <td className="px-4 py-2.5 text-[var(--tx-card)] font-semibold truncate max-w-[320px]" title={c.campanha}>{c.campanha}</td>
                        <td className="px-3 py-2.5 text-right text-[var(--tx-card2)] tabular-nums">{money(c.custo, moeda)}</td>
                        <td className="px-3 py-2.5 text-right text-[var(--tx-card2)] tabular-nums">{num(c.cliques)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: 'var(--green)' }}>{money(c.receita, moeda)}</td>
                        <td className="px-4 py-2.5 text-right font-bold tabular-nums" style={{ color: 'var(--red)' }}>{roasFmt(roas)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Vazio icone={IcCriativos} titulo="Sem campanhas nesta plataforma"
            descricao="Nenhuma campanha com investimento no período." />
        )}
      </Bloco>

      {/* Anúncios do canal */}
      <Bloco titulo={`Anúncios · ${canalNome(canal)}`}>
        {canal === 'meta' ? (
          <CriativosView criativos={cris} moeda={moeda}
            ecommerce={cliente.tipo === 'ecommerce'} carregando={carregandoCriativos} />
        ) : (
          <Vazio icone={IcCriativos} titulo="Criativos individuais indisponíveis"
            descricao={`A Windsor não retorna miniaturas de anúncios para ${canalNome(canal)} nesta conta.`} />
        )}
      </Bloco>
    </div>
  )
}
