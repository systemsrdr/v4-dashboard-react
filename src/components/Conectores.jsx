import React from 'react'
import { Card, CardHead, Bloco, Grid } from './ui'
import { limparCache } from '../lib/api'
import {
  IcConectores, IcMeta, IcGoogle, IcTikTok, IcKommo, IcShopify, IcRaio,
} from '../icons'

export default function Conectores({ cliente, metricas }) {
  const fontes = [
    { nome: 'Meta Ads',   Ic: IcMeta,   ids: cliente.metaIds,   via: 'Windsor.ai' },
    { nome: 'Google Ads', Ic: IcGoogle, ids: cliente.googleIds, via: 'Windsor.ai' },
    { nome: 'TikTok Ads', Ic: IcTikTok, ids: cliente.tiktokIds, via: 'Windsor.ai' },
    {
      nome: cliente.vendaSource === 'kommo' ? 'Kommo CRM'
          : cliente.vendaSource === 'tray'  ? 'Tray'
          : 'Shopify',
      Ic: cliente.vendaSource === 'kommo' ? IcKommo : IcShopify,
      ids: cliente.sheet || cliente.funilSheet ? ['Planilha conectada'] : [],
      via: 'Google Sheets (CSV)',
    },
  ]

  return (
    <>
      <Bloco titulo="Fontes de dados conectadas" icone={IcConectores}>
        <Grid cols={2}>
          {fontes.map(f => {
            const ativo = f.ids && f.ids.length > 0
            return (
              <Card key={f.nome} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: ativo ? 'var(--red-soft)' : 'var(--card-alt)', color: ativo ? 'var(--red)' : 'var(--tx-card3)' }}>
                  <f.Ic size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[13px] font-bold text-[var(--tx-card)]">{f.nome}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        background: ativo ? 'var(--green-soft)' : 'var(--card-alt)',
                        color: ativo ? 'var(--green)' : 'var(--tx-card3)',
                      }}>
                      {ativo ? 'Conectado' : 'Não configurado'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--tx-card3)] mb-2">Via {f.via}</p>
                  {ativo && (
                    <div className="flex flex-wrap gap-1">
                      {f.ids.map(id => (
                        <code key={id} className="text-[10px] px-2 py-1 rounded-md bg-[var(--card-alt)] text-[var(--tx-card2)] font-mono">
                          {id}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </Grid>
      </Bloco>

      <Bloco titulo="Cache e performance" icone={IcRaio}>
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h4 className="text-[13px] font-bold text-[var(--tx-card)] mb-1">Cache inteligente</h4>
              <p className="text-[12px] text-[var(--tx-card2)] leading-relaxed max-w-lg">
                As métricas consolidadas ficam em cache por 15 minutos em memória e no navegador.
                Isso mantém a navegação instantânea entre as abas sem refazer chamadas à Windsor.ai.
                Limpe o cache se precisar forçar dados totalmente novos.
              </p>
            </div>
            <button
              onClick={() => { limparCache(); window.location.reload() }}
              className="text-[12px] font-bold px-4 py-2.5 rounded-xl bg-[var(--red)] text-white hover:bg-[#C40711] transition-colors shrink-0">
              Limpar cache e recarregar
            </button>
          </div>
        </Card>
      </Bloco>
    </>
  )
}
