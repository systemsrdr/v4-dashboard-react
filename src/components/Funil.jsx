import React from 'react'
import { Card, CardHead } from './ui'
import { numFull, moneyFull } from '../lib/format'

/* Funil trapezoidal — taxa de conversão em selo entre etapas (estilo premium) */
const CORES = [
  'linear-gradient(135deg,#FF2A34,#E50914)',
  'linear-gradient(135deg,#C40711,#8E0710)',
  'linear-gradient(135deg,#3A3F4C,#282C37)',
  'linear-gradient(135deg,#5E0209,#3A0206)',
  'linear-gradient(135deg,#E50914,#7A040C)',
]

export default function Funil({ etapas, moeda = 'BRL', titulo, sub, direita, altura = 68 }) {
  const base = Math.max(...etapas.map(e => e.valor), 1)
  const larguras = etapas.map(e => Math.max(30, (e.valor / base) * 100))

  return (
    <Card pad={false}>
      {titulo && <CardHead titulo={titulo} sub={sub} direita={direita} />}
      <div className="px-4 sm:px-6 py-6 flex flex-col items-center">
        {etapas.map((e, i) => {
          const w = larguras[i]
          const wNext = larguras[i + 1] ?? w * 0.8
          const anterior = i > 0 ? etapas[i - 1].valor : null
          const taxa = anterior > 0 ? (e.valor / anterior) * 100 : null
          const cpa = e.custo > 0 && e.valor > 0 ? e.custo / e.valor : 0
          const inset = ((w - wNext) / 2 / w) * 100
          const clip = `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)`

          return (
            <React.Fragment key={i}>
              {taxa !== null && (
                <div className="flex items-center gap-1.5 py-1.5 text-[11px] font-bold" style={{ color: 'var(--tx-card3)' }}>
                  <span className="opacity-60">▾</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
                    {taxa.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
              )}
              <div className="w-full flex justify-center">
                <div
                  className="relative flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.01]"
                  style={{
                    width: `${w}%`, minWidth: 200, minHeight: altura,
                    background: CORES[i % CORES.length], clipPath: clip,
                    padding: '12px 30px', boxShadow: '0 10px 24px rgba(0,0,0,.18)',
                  }}
                >
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/35">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-[.12em] text-white/75 leading-tight">
                    {e.rotulo}{e.origem && <span className="ml-1.5 font-semibold opacity-70">· {e.origem}</span>}
                  </div>
                  <div className="text-[24px] font-extrabold text-white leading-none mt-1 tabular-nums">
                    {numFull(e.valor)}
                  </div>
                  {cpa > 0 && (
                    <div className="text-[10px] font-semibold text-white/65 mt-1 leading-none">
                      CPA {moneyFull(cpa, moeda)}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          )
        })}

        {etapas.length > 1 && etapas[0].valor > 0 && (
          <div className="mt-5 flex items-center gap-2 text-[11px]">
            <span style={{ color: 'var(--tx-card3)' }}>Conversão total do funil</span>
            <span className="font-bold px-2.5 py-1 rounded-md" style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
              {((etapas[etapas.length - 1].valor / etapas[0].valor) * 100).toFixed(2).replace('.', ',')}%
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
