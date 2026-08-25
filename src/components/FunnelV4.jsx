import { useState } from 'react'
import { LogoV4 } from '../icons'
import { fv4Color } from '../lib/format'

// Funil V4 — estilo Supermetrics, paleta vermelho→preto (sem azul).
// Menor e com melhor distribuição espacial que a versão anterior.
export function FunnelV4({ steps, tab, onTab, fmt }) {
  const n = steps.length
  const width = (i) => 100 - (n > 1 ? i / (n - 1) : 0) * 40

  return (
    <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b flex-wrap gap-2" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 24, background: 'var(--red)' }}>
            <LogoV4 width={17} height={13} style={{ color: '#fff' }} />
          </span>
          <div>
            <div className="text-[14px] font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>Desempenho de campanhas</div>
            <div className="text-[9px] font-semibold uppercase tracking-wide mt-px" style={{ color: 'var(--text-3)' }}>V4 Company RDR</div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {['all', 'meta', 'google'].map((t) => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors"
              style={tab === t
                ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }
                : { background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }}
            >
              {t === 'all' ? 'Todas' : t === 'meta' ? 'Meta' : 'Google'}
            </button>
          ))}
        </div>
      </div>
      <div>
        {steps.map((s, i) => {
          const col = fv4Color(i, n)
          return (
            <div key={i} className="flex items-stretch min-h-[46px]">
              <div
                className="flex items-center px-4 text-white min-w-0"
                style={{ flex: `0 0 ${width(i)}%`, background: col, borderBottom: '1px solid rgba(255,255,255,.16)' }}
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-85 whitespace-nowrap overflow-hidden text-ellipsis">{s.l}</div>
                  <div className="text-[16px] font-extrabold tracking-tight whitespace-nowrap">{s.v}</div>
                </div>
              </div>
              <div
                className="flex-1 flex flex-col items-end justify-center px-4 min-w-[110px]"
                style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
              >
                {s.side != null && (
                  <>
                    <div className="text-[9px] font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{s.sideL}</div>
                    <div className="text-[13px] font-extrabold whitespace-nowrap" style={{ color: 'var(--text)' }}>{s.side}</div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
