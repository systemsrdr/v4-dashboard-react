import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../hooks/useTheme'
import { InfoTip } from './ui'
import { sn, cleanCamp } from '../lib/format'

const DONUT = ['#E8000D', '#111014', '#B4000A', '#F59E0B', '#5A5A60', '#EA4335', '#9CA3AF']

function useAxis() {
  const { theme } = useTheme()
  return { grid: theme === 'dark' ? '#2A2A33' : '#E8EAED', txt: theme === 'dark' ? '#B4B7C0' : '#4B5563' }
}

function Panel({ title, tip, children, height = 240 }) {
  return (
    <div className="card p-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center gap-1.5 mb-3">
        <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{title}</div>
        {tip && <InfoTip text={tip} />}
      </div>
      <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>
    </div>
  )
}

const tooltipStyle = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }

// Investimento por plataforma (Meta / Google / TikTok)
export function SpendByPlatform({ mSp, gSp, tSp, fmt }) {
  const ax = useAxis()
  const data = [
    { name: 'Meta', valor: Math.round(mSp), fill: '#E8000D' },
    ...(gSp > 0 ? [{ name: 'Google', valor: Math.round(gSp), fill: '#111014' }] : []),
    ...(tSp > 0 ? [{ name: 'TikTok', valor: Math.round(tSp), fill: '#B4000A' }] : []),
  ]
  return (
    <Panel title="Investimento por plataforma" tip="Origem: Meta/Google/TikTok Ads API. Gasto total por canal no período.">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={ax.grid} />
        <XAxis type="number" tick={{ fontSize: 10, fill: ax.txt }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt.simb() + (v / 1000).toFixed(0) + 'k'} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: ax.txt, fontWeight: 600 }} width={60} axisLine={false} tickLine={false} />
        <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={tooltipStyle} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={30}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </Panel>
  )
}

// Top campanhas por investimento (barra horizontal)
export function TopCampaigns({ mG, fmt }) {
  const ax = useAxis()
  const data = mG.slice(0, 7).map((d) => ({ name: sn(cleanCamp(d.c), 18), Gasto: Math.round(d.sp) }))
  return (
    <Panel title="Top campanhas" tip="Origem: Meta Ads API. As 7 campanhas com maior investimento.">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={ax.grid} />
        <XAxis type="number" tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt.simb() + (v / 1000).toFixed(0) + 'k'} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: ax.txt }} width={110} axisLine={false} tickLine={false} />
        <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={tooltipStyle} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="Gasto" fill="#E8000D" radius={[0, 5, 5, 0]} barSize={13} />
      </BarChart>
    </Panel>
  )
}

// Distribuição do investimento entre campanhas (donut)
export function SpendDonut({ mG, fmt }) {
  const top = mG.slice(0, 6).map((d) => ({ name: sn(cleanCamp(d.c), 16), value: Math.round(d.sp) }))
  const rest = mG.slice(6)
  if (rest.length) top.push({ name: `Outras (${rest.length})`, value: Math.round(rest.reduce((a, x) => a + x.sp, 0)) })
  return (
    <Panel title="Distribuição de investimento" tip="Origem: Meta Ads API. Participação de cada campanha no gasto total.">
      <PieChart>
        <Pie data={top} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={82} paddingAngle={2} stroke="none">
          {top.map((d, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
        </Pie>
        <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </PieChart>
    </Panel>
  )
}

// Resultados por campanha (barra horizontal) — WhatsApp+Leads ou Vendas
export function ResultsByCampaign({ mG, isEc, fmt }) {
  const ax = useAxis()
  const data = mG
    .map((d) => ({ name: sn(cleanCamp(d.c), 18), valor: isEc ? Math.round(d.pur || 0) : Math.round((d.wpp || 0) + (d.leads || 0)) }))
    .filter((d) => d.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 7)
  if (!data.length) return null
  return (
    <Panel title={isEc ? 'Vendas por campanha' : 'Resultados por campanha'} tip={isEc ? 'Origem: Meta Ads API. Compras atribuídas por campanha.' : 'Origem: Meta Ads API. WhatsApp + Leads por campanha.'}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={ax.grid} />
        <XAxis type="number" tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: ax.txt }} width={110} axisLine={false} tickLine={false} />
        <RTooltip formatter={(v) => fmt.fn(v)} contentStyle={tooltipStyle} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="valor" fill="#10B981" radius={[0, 5, 5, 0]} barSize={13} />
      </BarChart>
    </Panel>
  )
}

// Eficiência: CTR e CPC por plataforma (barra dupla)
export function EfficiencyBars({ mG, gG, fmt }) {
  const ax = useAxis()
  const mImp = mG.reduce((a, x) => a + x.imp, 0), mClk = mG.reduce((a, x) => a + x.clk, 0), mSp = mG.reduce((a, x) => a + x.sp, 0)
  const gImp = gG.reduce((a, x) => a + x.imp, 0), gClk = gG.reduce((a, x) => a + x.clk, 0), gSp = gG.reduce((a, x) => a + x.sp, 0)
  const data = [
    { name: 'CTR (%)', Meta: +(mImp > 0 ? mClk / mImp * 100 : 0).toFixed(2), Google: +(gImp > 0 ? gClk / gImp * 100 : 0).toFixed(2) },
    { name: 'CPC', Meta: +(mClk > 0 ? mSp / mClk : 0).toFixed(2), Google: +(gClk > 0 ? gSp / gClk : 0).toFixed(2) },
  ]
  return (
    <Panel title="Eficiência por plataforma" tip="Origem: Meta/Google Ads API. CTR = Cliques ÷ Impressões. CPC = Investimento ÷ Cliques.">
      <BarChart data={data} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} stroke={ax.grid} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: ax.txt, fontWeight: 600 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} />
        <RTooltip contentStyle={tooltipStyle} cursor={{ fill: 'transparent' }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Meta" fill="#E8000D" radius={[5, 5, 0, 0]} barSize={26} />
        <Bar dataKey="Google" fill="#111014" radius={[5, 5, 0, 0]} barSize={26} />
      </BarChart>
    </Panel>
  )
}
