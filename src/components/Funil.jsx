import React from 'react'
import { Card, CardHead, Dica } from './ui'
import { numFull, money } from '../lib/format'

/**
 * Funil trapezoidal empilhado (estilo Supermetrics / referência V4).
 * Cada etapa é um polígono que estreita para a etapa seguinte.
 *
 * etapas: [{ rotulo, valor, custo?, origem?, dica? }]
 */
export default function Funil({ etapas, moeda = 'BRL', titulo, sub, direita, altura = 62 }) {
  const base = Math.max(...etapas.map(e => e.valor), 1)

  /* largura relativa de cada etapa, com piso de 26% para legibilidade */
  const larguras = etapas.map(e => Math.max(26, (e.valor / base) * 100))

  /* alternância vermelho / grafite escuro, como na referência */
  const cores = [
    'linear-gradient(135deg,#E50914,#A00610)',
    'linear-gradient(135deg,#1C1F26,#0F1115)',
    'linear-gradient(135deg,#3A3F4C,#282C37)',
    'linear-gradient(135deg,#8E0710,#5E0209)',
    'linear-gradient(135deg,#E50914,#7A040C)',
  ]

  return (
    <Card pad={false}>
      {titulo && <CardHead titulo={titulo} sub={sub} direita={direita} />}
      <div className="px-5 py-6 flex flex-col items-center gap-[3px]">
        {etapas.map((e, i) => {
          const w = larguras[i]
          const wNext = larguras[i + 1] ?? w * 0.82
          const anterior = i > 0 ? etapas[i - 1].valor : null
          const taxa = anterior > 0 ? (e.valor / anterior) * 100 : null
          const cpa = e.custo > 0 && e.valor > 0 ? e.custo / e.valor : 0

          /* trapézio: topo com largura w, base com largura wNext */
          const inset = (w - wNext) / 2 / w * 100
          const clip = `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)`

          return (
            <div key={i} className="w-full flex flex-col items-center">
              <div
                className="relative flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.015]"
                style={{
                  width: `${w}%`,
                  minHeight: altura,
                  background: cores[i % cores.length],
                  clipPath: clip,
                  padding: '10px 26px',
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[.1em] text-white/70 leading-tight">
                  {e.rotulo}
                  {e.origem && <span className="ml-1.5 opacity-70">· {e.origem}</span>}
                </div>
                <div className="text-[22px] font-extrabold text-white leading-none mt-1 tabular-nums">
                  {numFull(e.valor)}
                </div>
                {(taxa !== null || cpa > 0) && (
                  <div className="text-[10px] font-semibold text-white/60 mt-1 leading-none">
                    {taxa !== null && <span>Conversão: {taxa.toFixed(1).replace('.', ',')}%</span>}
                    {taxa !== null && cpa > 0 && <span className="mx-1.5">·</span>}
                    {cpa > 0 && <span>CPA {money(cpa, moeda)}</span>}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* legenda de conversão ponta a ponta */}
      {etapas.length > 1 && etapas[0].valor > 0 && (
        <div className="px-5 pb-4 -mt-1">
          <div className="flex items-center justify-center gap-2 text-[11px]">
            <span className="text-[var(--tx-card3)]">Conversão total do funil</span>
            <span className="font-bold px-2 py-0.5 rounded-md"
              style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
              {((etapas[etapas.length - 1].valor / etapas[0].valor) * 100).toFixed(3).replace('.', ',')}%
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}
