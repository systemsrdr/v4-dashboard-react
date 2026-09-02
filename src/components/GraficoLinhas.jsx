import React from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, Cell,
} from 'recharts'
import { Card, CardHead } from './ui'
import { money, roasFmt } from '../lib/format'

/* Paleta sem azul: vermelho V4 · grafite · verde · âmbar */
export const PALETA = ['#E50914', '#282C37', '#12B76A', '#F5A623', '#8A1218']

const eixo   = { fill: '#969DAA', fontSize: 10 }
const grade  = { stroke: '#EDEFF3', strokeDasharray: '3 3' }
const tipEstilo = {
  background: '#12141A', border: '1px solid #282C37', borderRadius: 12,
  fontSize: 12, color: '#F2F4F8', padding: '8px 12px',
}

/* ── LINHAS: Investimento × Receita ─────────────────── */
export function LinhasInvestimentoReceita({ dados, moeda, titulo = 'Investimento × Receita', sub, altura = 220 }) {
  return (
    <Card pad={false}>
      <CardHead titulo={titulo} sub={sub} />
      <div className="p-4" style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid {...grade} vertical={false} />
            <XAxis dataKey="canal" tick={eixo} axisLine={false} tickLine={false} />
            <YAxis tick={eixo} axisLine={false} tickLine={false}
              tickFormatter={v => money(v, moeda)} width={62} />
            <Tooltip contentStyle={tipEstilo} cursor={{ stroke: '#E6E8EC' }}
              formatter={(v, n) => [money(v, moeda), n]} />
            <Legend iconType="circle" iconSize={7}
              wrapperStyle={{ fontSize: 11, color: '#5B6473', paddingTop: 4 }} />
            <Line type="monotone" dataKey="investimento" name="Investimento"
              stroke="#E50914" strokeWidth={2.5} dot={{ r: 4, fill: '#E50914' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="receita" name="Receita"
              stroke="#12B76A" strokeWidth={2.5} dot={{ r: 4, fill: '#12B76A' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

/* ── BARRAS: ROAS por canal ─────────────────────────── */
export function BarrasRoas({ dados, titulo = 'ROAS por canal', sub, altura = 220 }) {
  return (
    <Card pad={false}>
      <CardHead titulo={titulo} sub={sub} />
      <div className="p-4" style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
            <CartesianGrid {...grade} vertical={false} />
            <XAxis dataKey="canal" tick={eixo} axisLine={false} tickLine={false} />
            <YAxis tick={eixo} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} width={44} />
            <Tooltip contentStyle={tipEstilo} cursor={{ fill: 'rgba(229,9,20,.05)' }}
              formatter={v => [roasFmt(v), 'ROAS']} />
            <Bar dataKey="roas" radius={[8, 8, 0, 0]} maxBarSize={52}>
              {dados.map((d, i) => (
                <Cell key={i} fill={d.roas >= 3 ? '#12B76A' : d.roas >= 1 ? '#F5A623' : '#E50914'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

/* ── BARRAS AGRUPADAS genéricas ─────────────────────── */
export function BarrasComparativas({ dados, chaves, moeda, titulo, sub, altura = 220, formatador }) {
  const fmt = formatador || (v => money(v, moeda))
  return (
    <Card pad={false}>
      <CardHead titulo={titulo} sub={sub} />
      <div className="p-4" style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid {...grade} vertical={false} />
            <XAxis dataKey="nome" tick={eixo} axisLine={false} tickLine={false} />
            <YAxis tick={eixo} axisLine={false} tickLine={false} tickFormatter={fmt} width={62} />
            <Tooltip contentStyle={tipEstilo} cursor={{ fill: 'rgba(229,9,20,.05)' }}
              formatter={(v, n) => [fmt(v), n]} />
            <Legend iconType="circle" iconSize={7}
              wrapperStyle={{ fontSize: 11, color: '#5B6473', paddingTop: 4 }} />
            {chaves.map((k, i) => (
              <Bar key={k.chave} dataKey={k.chave} name={k.rotulo}
                fill={PALETA[i % PALETA.length]} radius={[6, 6, 0, 0]} maxBarSize={34} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
