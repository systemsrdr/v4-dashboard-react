import React, { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { presetDatas, rotuloPeriodo } from '../lib/format'
import { IcSol, IcLua, IcRaio } from '../icons'

const ATALHOS = [
  { id: 'hoje',        rotulo: 'Hoje' },
  { id: '7d',          rotulo: 'Últimos 7 dias' },
  { id: '30d',         rotulo: 'Últimos 30 dias' },
  { id: 'este-mes',    rotulo: 'Este mês' },
  { id: 'mes-passado', rotulo: 'Mês passado' },
]

export default function Header({ periodo, onPeriodo, cliente, carregando, larguraSidebar }) {
  const { tema, alternar } = useTheme()
  const [de, setDe]   = useState(periodo.de)
  const [ate, setAte] = useState(periodo.ate)
  const [abertoCustom, setAbertoCustom] = useState(false)

  useEffect(() => { setDe(periodo.de); setAte(periodo.ate) }, [periodo.de, periodo.ate])

  return (
    <header
      className="fixed top-0 right-0 h-[58px] z-40 flex items-center gap-3 px-5 border-b border-[var(--border2)] bg-[#0B0C10] transition-[left] duration-200"
      style={{ left: larguraSidebar }}
    >
      {/* Cliente + moeda */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[13px] font-bold text-white">{cliente.nome}</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[.07] text-white/45 uppercase tracking-wide">
          {cliente.moeda === 'EUR' ? '€ EUR' : 'R$ BRL'}
        </span>
      </div>

      <div className="w-px h-5 bg-[var(--border2)] shrink-0" />

      {/* Atalhos */}
      <div className="flex items-center gap-1 flex-wrap min-w-0">
        {ATALHOS.map(a => (
          <button key={a.id}
            onClick={() => { onPeriodo({ ...presetDatas(a.id), preset: a.id }); setAbertoCustom(false) }}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${
              periodo.preset === a.id
                ? 'bg-[var(--red)] text-white border-[var(--red)]'
                : 'text-white/45 border-white/12 hover:text-white hover:border-white/25'
            }`}>
            {a.rotulo}
          </button>
        ))}
        <button onClick={() => setAbertoCustom(o => !o)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${
            periodo.preset === 'custom'
              ? 'bg-[var(--red)] text-white border-[var(--red)]'
              : 'text-white/45 border-white/12 hover:text-white hover:border-white/25'
          }`}>
          Personalizado
        </button>
      </div>

      {/* Campo custom */}
      {abertoCustom && (
        <div className="absolute top-full right-5 mt-2 p-3 rounded-xl bg-[#15171E] border border-[var(--border2)] shadow-lift flex items-center gap-2 z-50">
          <input type="date" value={de} onChange={e => setDe(e.target.value)}
            className="text-[11px] bg-white/[.05] border border-white/12 rounded-lg px-2.5 py-1.5 text-white" />
          <span className="text-white/30 text-[11px]">até</span>
          <input type="date" value={ate} onChange={e => setAte(e.target.value)}
            className="text-[11px] bg-white/[.05] border border-white/12 rounded-lg px-2.5 py-1.5 text-white" />
          <button onClick={() => { onPeriodo({ de, ate, preset: 'custom' }); setAbertoCustom(false) }}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[var(--red)] text-white hover:bg-[#C40711] transition-colors">
            Aplicar
          </button>
        </div>
      )}

      {/* Direita */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <span className="hidden xl:block text-[11px] text-white/30 tabular-nums">{rotuloPeriodo(periodo.de, periodo.ate)}</span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap"
          style={{ color: carregando ? 'var(--amber)' : 'var(--green)' }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'currentColor' }} />
          {carregando ? 'Atualizando' : 'Ao vivo'}
        </span>
        <button onClick={alternar} title="Alternar tema"
          className="w-8 h-8 rounded-lg border border-white/12 text-white/45 hover:text-white hover:border-white/25 transition-all flex items-center justify-center">
          {tema === 'dark' ? <IcSol size={15} /> : <IcLua size={15} />}
        </button>
      </div>
    </header>
  )
}
