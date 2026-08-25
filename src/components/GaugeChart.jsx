import ReactECharts from 'echarts-for-react'
import { useTheme } from '../hooks/useTheme'
import { InfoTip } from './ui'

// Velocímetro (gauge) para metas/KPIs — ECharts.
// value: valor atual; max: teto da meta; label: rótulo central; unit: sufixo.
export function GaugeChart({ title, value, max, unit = '', label, tip, invert = false }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const txt = dark ? '#B4B7C0' : '#4B5563'
  const track = dark ? '#2A2A33' : '#EFEFF2'

  // Progresso 0..1. Em métricas "quanto menor melhor" (invert), a barra enche ao ficar abaixo da meta.
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max,
      progress: { show: true, width: 12, roundCap: true, itemStyle: { color: '#E8000D' } },
      axisLine: { lineStyle: { width: 12, color: [[1, track]] } },
      pointer: { show: true, length: '62%', width: 4, itemStyle: { color: dark ? '#F4F5F7' : '#111014' } },
      anchor: { show: true, size: 10, itemStyle: { color: dark ? '#F4F5F7' : '#111014' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '38%'],
        fontSize: 20, fontWeight: 800, fontFamily: 'Inter',
        color: dark ? '#F4F5F7' : '#1A1A2E',
        formatter: (v) => `${unit}${Math.round(v).toLocaleString('pt-BR')}`,
      },
      data: [{ value }],
    }],
  }

  return (
    <div className="card p-4" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{title}</div>
        {tip && <InfoTip text={tip} />}
      </div>
      <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{label}</div>
      <ReactECharts option={option} style={{ height: 150 }} notMerge lazyUpdate opts={{ renderer: 'svg' }} />
      <div className="text-center text-[10px] font-semibold -mt-2" style={{ color: txt }}>
        Meta: {unit}{max.toLocaleString('pt-BR')}
      </div>
    </div>
  )
}
