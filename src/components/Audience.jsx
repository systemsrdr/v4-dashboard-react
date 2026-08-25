import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, Legend, CartesianGrid } from 'recharts'
import { useTheme } from '../hooks/useTheme'
import { InfoTip } from './ui'

// ── Meta Ads vs Google Ads (linhas comparativas, estilo Supermetrics) ──
export function VersusPanel({ rows, period }) {
  return (
    <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>
          Meta Ads <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>vs</span> Google Ads
        </div>
        <div className="text-[11px] font-semibold" style={{ color: 'var(--text-3)' }}>{period}</div>
      </div>
      <div>
        {rows.map((r, i) => {
          const total = (r.mNum || 0) + (r.gNum || 0)
          const mPct = total > 0 ? (r.mNum / total * 100) : 50
          const gPct = total > 0 ? (r.gNum / total * 100) : 50
          const showBar = !r.inv && total > 0
          return (
            <div key={i} className="grid items-center px-5 py-3.5 border-b gap-4" style={{ gridTemplateColumns: '1fr auto 1fr', borderColor: 'var(--border)' }}>
              <div className="text-center">
                <div className="text-[9px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>{r.label}</div>
                <div className="text-[22px] font-extrabold leading-none" style={{ color: r.mWin ? 'var(--red)' : 'var(--text)' }}>{r.mFmt}</div>
                {showBar && <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--surface-3)' }}><div className="h-full" style={{ width: `${mPct}%`, background: 'var(--red)' }} /></div>}
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-2xl border text-center min-w-[46px]" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-3)' }}>VS</div>
              <div className="text-center">
                <div className="text-[9px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>{r.label}</div>
                <div className="text-[22px] font-extrabold leading-none" style={{ color: r.gWin ? 'var(--red-soft)' : 'var(--text)' }}>{r.gFmt}</div>
                {showBar && <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--surface-3)' }}><div className="h-full" style={{ width: `${gPct}%`, background: 'var(--red-soft)' }} /></div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Donut de gênero (Recharts) ──
export function GenderDonut({ male, female, other }) {
  const { theme } = useTheme()
  const txt = theme === 'dark' ? '#B4B7C0' : '#4B5563'
  const data = [
    { name: 'Masculino', value: male, color: '#111014' },
    { name: 'Feminino', value: female, color: '#E8000D' },
    { name: 'Outros', value: other, color: '#9CA3AF' },
  ].filter((d) => d.value > 0)
  const total = data.reduce((a, d) => a + d.value, 0)
  return (
    <div className="card p-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center gap-1.5">
        <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Gênero</div>
        <InfoTip text="Origem: Meta Ads API (breakdown gender). Cliques por gênero no período." />
      </div>
      <div className="text-[11px] mb-2" style={{ color: 'var(--text-3)' }}>Cliques por gênero</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <RTooltip formatter={(v) => [`${v.toLocaleString('pt-BR')} (${total ? (v / total * 100).toFixed(1) : 0}%)`, '']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
          <Legend wrapperStyle={{ fontSize: 11, color: txt }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Barras de idade (masculino vs feminino) ──
export function AgeBars({ data }) {
  const { theme } = useTheme()
  const grid = theme === 'dark' ? '#2A2A33' : '#E8EAED'
  const txt = theme === 'dark' ? '#B4B7C0' : '#4B5563'
  return (
    <div className="card p-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center gap-1.5">
        <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Alcance & Cliques por Idade</div>
        <InfoTip text="Origem: Meta Ads API (breakdown age, gender). Distribuição de cliques por faixa etária." />
      </div>
      <div className="text-[11px] mb-3" style={{ color: 'var(--text-3)' }}>Distribuição demográfica · Meta Ads</div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
          <CartesianGrid horizontal={false} stroke={grid} />
          <XAxis type="number" tick={{ fontSize: 10, fill: txt }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="age" tick={{ fontSize: 11, fill: txt }} axisLine={false} tickLine={false} width={44} />
          <RTooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="Masculino" fill="#111014" radius={[0, 4, 4, 0]} barSize={11} />
          <Bar dataKey="Feminino" fill="#E8000D" radius={[0, 4, 4, 0]} barSize={11} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
