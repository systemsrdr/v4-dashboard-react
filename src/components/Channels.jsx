import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../hooks/useTheme'
import { KpiCard, InfoTip } from './ui'
import { sn, cleanCamp } from '../lib/format'
import { IconWallet, IconTarget, IconMouse, IconTrophy, IconGlobe, IconMusic, IconCart, IconTrendUp, IconTicket, IconLayers, IconCheck, IconClipboard, IconBriefcase } from '../icons'

const DONUT = ['#E8000D', '#111014', '#B4000A', '#F59E0B', '#5A5A60', '#EA4335', '#9CA3AF']

function useAxis() {
  const { theme } = useTheme()
  return { grid: theme === 'dark' ? '#2A2A33' : '#E8EAED', txt: theme === 'dark' ? '#B4B7C0' : '#4B5563' }
}

function ChartCard({ title, tip, children, height = 260 }) {
  return (
    <div className="card p-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center gap-1.5 mb-3">
        <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{title}</div>
        {tip && <InfoTip text={tip} />}
      </div>
      <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>
    </div>
  )
}

function Table({ head, children }) {
  return (
    <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {head.map((h, i) => (
                <th key={i} className="text-left font-bold uppercase tracking-wide px-3 py-2.5 text-[10px] whitespace-nowrap" style={{ color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}
function Td({ children, hi }) {
  return <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: hi ? 'var(--text)' : 'var(--text-2)', fontWeight: hi ? 700 : 500, borderBottom: '1px solid var(--border)' }}>{children}</td>
}
function Badge({ children, tone }) {
  const map = { grn: ['var(--grn-2)', 'var(--grn)'], amb: ['var(--amb-2)', 'var(--amb)'], red: ['var(--red-2)', 'var(--red)'], ink: ['var(--surface-3)', 'var(--text-2)'] }
  const [bg, fg] = map[tone] || map.ink
  return <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px]" style={{ background: bg, color: fg }}>{children}</span>
}

// ─────────────────── META ───────────────────
export function MetaChannel({ mG, fmt, tipo }) {
  const ax = useAxis()
  const isEc = tipo === 'ec'
  const sp = mG.reduce((a, x) => a + x.sp, 0)
  const conv = mG.reduce((a, x) => a + (x.wpp || 0) + (x.leads || 0), 0)
  const pur = mG.reduce((a, x) => a + (x.pur || 0), 0)
  const rev = mG.reduce((a, x) => a + (x.rev || 0), 0)
  const clk = mG.reduce((a, x) => a + x.clk, 0)
  const imp = mG.reduce((a, x) => a + x.imp, 0)
  const wpp = mG.reduce((a, x) => a + (x.wpp || 0), 0)
  const leads = mG.reduce((a, x) => a + (x.leads || 0), 0)

  const top = mG.slice(0, 8)
  const donut = mG.slice(0, 6).map((d) => ({ name: sn(cleanCamp(d.c), 18), value: Math.round(d.sp) }))
  const rest = mG.slice(6)
  if (rest.length) donut.push({ name: `Outras (${rest.length})`, value: Math.round(rest.reduce((a, x) => a + x.sp, 0)) })

  const kpis = isEc
    ? [
      { icon: IconWallet, label: 'Investimento', value: fmt.fr(sp), sub: `${mG.length} campanhas`, stripe: 'red' },
      { icon: IconCart, label: 'Compras', value: fmt.fn(pur), sub: `Receita ${fmt.fr(rev)}`, stripe: 'grn' },
      { icon: IconTrendUp, label: 'ROAS', value: sp > 0 && rev > 0 ? (rev / sp).toFixed(2) + 'x' : '—', sub: 'Receita ÷ Gasto', stripe: 'pur', tip: 'Origem: Meta Ads API → Receita ÷ Investimento.' },
      { icon: IconTarget, label: 'CPA', value: pur > 0 ? fmt.fr(sp / pur) : '—', sub: 'Custo por compra', stripe: 'ink', tip: 'Origem: Meta Ads API → Investimento ÷ Compras.' },
    ]
    : [
      { icon: IconWallet, label: 'Investimento', value: fmt.fr(sp), sub: `${mG.length} campanhas`, stripe: 'red' },
      { icon: IconTarget, label: 'Resultados', value: fmt.fn(conv), sub: `WhatsApp ${fmt.fn(wpp)} · Leads ${fmt.fn(leads)}`, stripe: 'grn' },
      { icon: IconTrendUp, label: 'Custo/Result.', value: conv > 0 ? fmt.fr(sp / conv) : '—', sub: 'Investimento ÷ Resultados', stripe: 'amb', tip: 'Origem: Meta Ads API → Investimento ÷ (WhatsApp + Leads).' },
      { icon: IconMouse, label: 'Cliques', value: fmt.fn(clk), sub: imp > 0 ? `CTR ${(clk / imp * 100).toFixed(2)}%` : '', stripe: 'ink' },
    ]

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <ChartCard title="Top campanhas" tip="Origem: Meta Ads API. Investimento e resultado por campanha.">
          <BarChart data={top.map((d) => ({ name: sn(cleanCamp(d.c), 16), Gasto: Math.round(d.sp), [isEc ? 'Receita' : 'Resultados']: isEc ? Math.round(d.rev) : Math.round((d.wpp || 0) + (d.leads || 0)) }))} layout="vertical" margin={{ left: 8, right: 12 }}>
            <CartesianGrid horizontal={false} stroke={ax.grid} />
            <XAxis type="number" tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: ax.txt }} width={110} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Gasto" fill="#E8000D" radius={[0, 4, 4, 0]} barSize={11} />
            <Bar dataKey={isEc ? 'Receita' : 'Resultados'} fill="#10B981" radius={[0, 4, 4, 0]} barSize={11} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Distribuição de investimento" tip="Origem: Meta Ads API. Participação de cada campanha no gasto.">
          <PieChart>
            <Pie data={donut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={2} stroke="none">
              {donut.map((d, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
            </Pie>
            <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ChartCard>
      </div>
      <Table head={['Campanha', 'Gasto', 'Impr.', 'Cliques', 'CTR', 'CPC', ...(isEc ? ['Compras', 'Receita', 'ROAS'] : ['WhatsApp', 'Leads', 'CPL'])]}>
        {mG.map((d, i) => {
          const cpl = d.leads > 0 ? d.sp / d.leads : 0
          const roas = d.sp > 0 && d.rev > 0 ? d.rev / d.sp : 0
          return (
            <tr key={i}>
              <Td hi>{sn(cleanCamp(d.c), 32)}</Td>
              <Td>{fmt.fr(d.sp)}</Td>
              <Td>{d.imp >= 1e6 ? (d.imp / 1e6).toFixed(1) + 'M' : fmt.fn(d.imp)}</Td>
              <Td>{fmt.fn(d.clk)}</Td>
              <Td>{fmt.fp(d.ctr)}</Td>
              <Td>{fmt.frr(d.cpc)}</Td>
              {isEc ? <>
                <Td>{fmt.fn(d.pur || 0)}</Td>
                <Td>{fmt.fr(d.rev || 0)}</Td>
                <Td>{roas ? <Badge tone={roas >= 2 ? 'grn' : 'amb'}>{roas.toFixed(2)}x</Badge> : '—'}</Td>
              </> : <>
                <Td>{fmt.fn(d.wpp || 0)}</Td>
                <Td>{fmt.fn(d.leads || 0)}</Td>
                <Td>{cpl ? <Badge tone={cpl < 30 ? 'grn' : cpl < 80 ? 'amb' : 'red'}>{fmt.frr(cpl)}</Badge> : '—'}</Td>
              </>}
            </tr>
          )
        })}
      </Table>
    </div>
  )
}

// ─────────────────── GOOGLE ───────────────────
export function GoogleChannel({ gG, fmt }) {
  const ax = useAxis()
  const sp = gG.reduce((a, x) => a + x.sp, 0)
  const conv = gG.reduce((a, x) => a + x.conv, 0)
  const clk = gG.reduce((a, x) => a + x.clk, 0)
  const bestCpa = gG.filter((d) => d.cpa > 0).length ? Math.min(...gG.filter((d) => d.cpa > 0).map((d) => d.cpa)) : 0

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <KpiCard icon={IconGlobe} label="Investimento" value={fmt.fr(sp)} sub={`${gG.length} campanhas`} stripe="red" />
        <KpiCard icon={IconTarget} label="Conversões" value={fmt.fn(Math.round(conv))} sub={`CPA ${fmt.fr(conv > 0 ? sp / conv : 0)}`} stripe="grn" tip="Origem: Google Ads API → Investimento ÷ Conversões." />
        <KpiCard icon={IconMouse} label="Cliques" value={fmt.fn(clk)} stripe="ink" />
        <KpiCard icon={IconTrophy} label="Melhor CPA" value={bestCpa ? fmt.frr(bestCpa) : '—'} sub="Menor custo/conv." stripe="amb" />
      </div>
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ChartCard title="Investimento por campanha" tip="Origem: Google Ads API.">
          <PieChart>
            <Pie data={gG.map((d) => ({ name: sn(cleanCamp(d.c), 18), value: Math.round(d.sp) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={2} stroke="none">
              {gG.map((d, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
            </Pie>
            <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ChartCard>
        <ChartCard title="CPA por campanha" tip="Origem: Google Ads API → Investimento ÷ Conversões por campanha.">
          <BarChart data={gG.map((d) => ({ name: sn(cleanCamp(d.c), 14), CPA: Math.round(d.cpa) }))}>
            <CartesianGrid vertical={false} stroke={ax.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} />
            <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Bar dataKey="CPA" radius={[6, 6, 0, 0]} barSize={40}>
              {gG.map((d, i) => <Cell key={i} fill={d.cpa === 0 ? '#9CA3AF' : d.cpa < 50 ? '#10B981' : d.cpa < 200 ? '#F59E0B' : '#E8000D'} />)}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
      <Table head={['Campanha', 'Gasto', 'Impr.', 'Cliques', 'CTR', 'CPC', 'Conv.', 'CPA']}>
        {gG.map((d, i) => (
          <tr key={i}>
            <Td hi>{sn(cleanCamp(d.c), 32)}</Td>
            <Td>{fmt.fr(d.sp)}</Td>
            <Td>{d.imp >= 1e6 ? (d.imp / 1e6).toFixed(1) + 'M' : fmt.fn(d.imp || 0)}</Td>
            <Td>{fmt.fn(d.clk)}</Td>
            <Td>{fmt.fp(d.ctr)}</Td>
            <Td>{fmt.frr(d.cpc)}</Td>
            <Td>{fmt.fn(Math.round(d.conv))}</Td>
            <Td>{d.cpa ? <Badge tone={d.cpa < 50 ? 'grn' : d.cpa < 200 ? 'amb' : 'red'}>{fmt.frr(d.cpa)}</Badge> : '—'}</Td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

// ─────────────────── TIKTOK ───────────────────
export function TikTokChannel({ tG, fmt }) {
  const ax = useAxis()
  const sp = tG.reduce((a, x) => a + x.sp, 0)
  const conv = tG.reduce((a, x) => a + x.conv, 0)
  const clk = tG.reduce((a, x) => a + x.clk, 0)
  const imp = tG.reduce((a, x) => a + x.imp, 0)
  const bestCpa = tG.filter((d) => d.cpa > 0).length ? Math.min(...tG.filter((d) => d.cpa > 0).map((d) => d.cpa)) : 0

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <KpiCard icon={IconMusic} label="Investimento" value={fmt.fr(sp)} sub={`${tG.length} campanhas`} stripe="red" />
        <KpiCard icon={IconTarget} label="Conversões" value={fmt.fn(Math.round(conv))} sub={`CPA ${fmt.fr(conv > 0 ? sp / conv : 0)}`} stripe="grn" tip="Origem: TikTok Ads API → Investimento ÷ Conversões." />
        <KpiCard icon={IconMouse} label="Cliques" value={fmt.fn(clk)} sub={imp > 0 ? `CTR ${(clk / imp * 100).toFixed(2)}%` : ''} stripe="ink" />
        <KpiCard icon={IconTrophy} label="Melhor CPA" value={bestCpa ? fmt.frr(bestCpa) : '—'} sub="Menor custo/conv." stripe="amb" />
      </div>
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ChartCard title="Investimento por campanha" tip="Origem: TikTok Ads API.">
          <PieChart>
            <Pie data={tG.map((d) => ({ name: sn(cleanCamp(d.c), 18), value: Math.round(d.sp) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={2} stroke="none">
              {tG.map((d, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
            </Pie>
            <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ChartCard>
        <ChartCard title="CPA por campanha" tip="Origem: TikTok Ads API → Investimento ÷ Conversões.">
          <BarChart data={tG.map((d) => ({ name: sn(cleanCamp(d.c), 14), CPA: Math.round(d.cpa) }))}>
            <CartesianGrid vertical={false} stroke={ax.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 9, fill: ax.txt }} axisLine={false} tickLine={false} />
            <RTooltip formatter={(v) => fmt.fr(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Bar dataKey="CPA" radius={[6, 6, 0, 0]} barSize={40}>
              {tG.map((d, i) => <Cell key={i} fill={d.cpa === 0 ? '#9CA3AF' : d.cpa < 50 ? '#10B981' : d.cpa < 200 ? '#F59E0B' : '#E8000D'} />)}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
      <Table head={['Campanha', 'Gasto', 'Impr.', 'Cliques', 'CTR', 'CPC', 'Conv.', 'CPA']}>
        {tG.map((d, i) => (
          <tr key={i}>
            <Td hi>{sn(cleanCamp(d.c), 32)}</Td>
            <Td>{fmt.fr(d.sp)}</Td>
            <Td>{d.imp >= 1e6 ? (d.imp / 1e6).toFixed(1) + 'M' : fmt.fn(d.imp || 0)}</Td>
            <Td>{fmt.fn(d.clk)}</Td>
            <Td>{fmt.fp(d.ctr)}</Td>
            <Td>{fmt.frr(d.cpc)}</Td>
            <Td>{fmt.fn(Math.round(d.conv))}</Td>
            <Td>{d.cpa ? <Badge tone={d.cpa < 50 ? 'grn' : d.cpa < 200 ? 'amb' : 'red'}>{fmt.frr(d.cpa)}</Badge> : '—'}</Td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

// ─────────────────── FONTE (Kommo/Shopify/Tray) ───────────────────
export function FonteChannel({ funilSource, funilSrc, totalSpend, fmt }) {
  const fs = funilSrc || {}
  const lbl = { kommo: 'Kommo', shopify: 'Shopify', tray: 'Tray' }[funilSource]
  const isKommo = funilSource === 'kommo'

  const kpis = isKommo
    ? [
      { icon: IconClipboard, label: 'MQL', value: fmt.fn(fs.mql || 0), sub: 'Leads qualificados mkt', stripe: 'red' },
      { icon: IconTarget, label: 'SQL', value: fmt.fn(fs.sql || 0), sub: 'Qualificados vendas', stripe: 'amb' },
      { icon: IconBriefcase, label: 'SQO', value: fmt.fn(fs.sqo || 0), sub: 'Oportunidades', stripe: 'ink' },
      { icon: IconCart, label: 'Vendas', value: fmt.fn(fs.vendas || 0), sub: `Receita ${fmt.fr(fs.receita || 0)}`, stripe: 'grn' },
    ]
    : [
      { icon: IconCart, label: 'Adições ao carrinho', value: fmt.fn(fs.carrinho || 0), stripe: 'amb' },
      { icon: IconCheck, label: 'Vendas', value: fmt.fn(fs.vendas || 0), sub: lbl, stripe: 'grn' },
      { icon: IconWallet, label: 'Receita', value: fmt.fr(fs.receita || 0), stripe: 'red' },
      { icon: IconTrendUp, label: 'ROAS', value: totalSpend > 0 && fs.receita > 0 ? (fs.receita / totalSpend).toFixed(2) + 'x' : '—', sub: 'Receita ÷ Investimento', stripe: 'ink', tip: `Origem: ${lbl} (planilha) → Receita ÷ Investimento em mídia.` },
    ]

  const hasData = Object.keys(fs).length > 0 && Object.values(fs).some((v) => v > 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <IconLayers width={18} height={18} style={{ color: 'var(--text-2)' }} />
        <div>
          <div className="text-[16px] font-extrabold" style={{ color: 'var(--text)' }}>{lbl} · Vendas & Funil</div>
          <div className="text-[12px]" style={{ color: 'var(--text-3)' }}>Dados sincronizados da planilha {lbl}</div>
        </div>
      </div>
      {!hasData && (
        <div className="card p-5 text-[13px] leading-relaxed" style={{ boxShadow: 'var(--shadow)', color: 'var(--text-2)' }}>
          Configure o link CSV da planilha <b>{lbl}</b> (campo <code>funilSheet</code> deste cliente em <code>src/lib/clients.js</code>) para exibir os números de fundo de funil aqui e no funil da Visão Geral.
        </div>
      )}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>
    </div>
  )
}
