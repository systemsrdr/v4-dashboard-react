import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { money } from '../lib/format'

const CORES = ['#E50914', '#282C37', '#F5A623', '#8E0710', '#12B76A']

export default function Rosca({ dados = [], moeda = 'BRL' }) {
  const lista = dados.filter(d => d.value > 0)
  const total = lista.reduce((a, d) => a + d.value, 0)
  if (!total) return <div className="h-[180px] grid place-items-center text-[12px]" style={{ color: 'var(--tx-card3)' }}>Sem investimento no período</div>
  return (
    <div className="flex flex-col items-center">
      <div className="w-full relative" style={{ height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={lista} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
              {lista.map((d, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
            </Pie>
            <Tooltip formatter={v => money(v, moeda)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--tx-card3)' }}>Total</div>
          <div className="text-[17px] font-extrabold" style={{ color: 'var(--tx-card)' }}>{money(total, moeda)}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
        {lista.map((d, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--tx-card2)' }}>
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CORES[i % CORES.length] }} />
            {d.name} · {Math.round((d.value / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  )
}
