import React from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, Legend,
} from 'recharts'
import { Card } from './ui'
import { money, num, roasFmt, pct } from '../lib/format'

const eixo = { fill: '#969DAA', fontSize: 9 }
const grade = { stroke: '#EDEFF3', strokeDasharray: '2 3' }
const tip = {
  background: '#12141A', border: '1px solid #282C37', borderRadius: 10,
  fontSize: 11, color: '#F2F4F8', padding: '7px 10px',
}

/* Cabeçalho compacto usado nos cards laterais */
function Topo({ titulo, sub }) {
  return (
    <div className="px-4 pt-3.5 pb-2">
      <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[var(--tx-card)] leading-tight">{titulo}</div>
      {sub && <div className="text-[10px] text-[var(--tx-card3)] mt-0.5">{sub}</div>}
    </div>
  )
}

/* ── BARRAS: investimento por origem ────────────────── */
export function InvestimentoPorOrigem({ dados, moeda, altura = 120 }) {
  return (
    <Card pad={false}>
      <Topo titulo="Investimento por origem" />
      <div className="px-2 pb-3" style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid {...grade} vertical={false} />
            <XAxis dataKey="canal" tick={eixo} axisLine={false} tickLine={false} />
            <YAxis tick={eixo} axisLine={false} tickLine={false} tickFormatter={v => money(v, moeda)} width={54} />
            <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(229,9,20,.05)' }}
              formatter={v => [money(v, moeda), 'Investimento']} />
            <Bar dataKey="investimento" radius={[4, 4, 0, 0]} maxBarSize={38}>
              {dados.map((_, i) => (
                <Cell key={i} fill={['#E50914', '#1C1F26', '#3A3F4C', '#8E0710'][i % 4]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

/* ── LINHA: série temporal genérica ─────────────────── */
export function SerieTemporal({ dados, chaves, titulo, sub, moeda, altura = 120, formato = 'moeda' }) {
  const fmt = formato === 'moeda' ? v => money(v, moeda)
            : formato === 'pct'   ? v => `${v.toFixed(0)}%`
            : v => num(v)
  return (
    <Card pad={false}>
      <Topo titulo={titulo} sub={sub} />
      <div className="px-2 pb-3" style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid {...grade} vertical={false} />
            <XAxis dataKey="dia" tick={eixo} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={eixo} axisLine={false} tickLine={false} tickFormatter={fmt} width={54} />
            <Tooltip contentStyle={tip} formatter={(v, n) => [fmt(v), n]} />
            {chaves.length > 1 && (
              <Legend iconType="circle" iconSize={6}
                wrapperStyle={{ fontSize: 10, color: '#5B6473', paddingTop: 2 }} />
            )}
            {chaves.map((k, i) => (
              <Line key={k.chave} type="monotone" dataKey={k.chave} name={k.rotulo}
                stroke={['#E50914', '#282C37', '#12B76A'][i % 3]}
                strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

/* ── DESEMPENHO POR CAMPANHA (blocos proporcionais) ─── */
export function BlocosCampanhas({ campanhas, moeda, titulo = 'Desempenho por campanha' }) {
  const top = campanhas.slice(0, 6)
  const max = Math.max(...top.map(c => c.custo), 1)

  return (
    <Card pad={false}>
      <Topo titulo={titulo} sub={`${campanhas.length} campanhas no período`} />
      <div className="px-3 pb-3 space-y-1.5">
        {top.map((c, i) => {
          const largura = Math.max(18, (c.custo / max) * 100)
          const escuro = i % 2 === 1
          return (
            <div key={i} className="relative h-[42px] rounded-lg overflow-hidden bg-[var(--card-alt)]">
              <div className="absolute inset-y-0 left-0 rounded-lg grow-bar"
                style={{
                  width: `${largura}%`,
                  background: escuro ? 'linear-gradient(90deg,#1C1F26,#282C37)' : 'linear-gradient(90deg,#E50914,#A00610)',
                  animationDelay: `${i * 50}ms`,
                }} />
              <div className="absolute inset-0 flex items-center justify-between px-3 gap-2">
                <span className="text-[10px] font-bold text-white truncate drop-shadow-sm max-w-[55%]"
                  title={c.campanha}>
                  {c.campanha}
                </span>
                <span className="text-[10px] font-bold tabular-nums shrink-0"
                  style={{ color: largura > 82 ? '#fff' : 'var(--tx-card2)' }}>
                  {money(c.custo, moeda)}
                  {c.roas > 0 && <span className="ml-1.5 opacity-80">{roasFmt(c.roas)}</span>}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
