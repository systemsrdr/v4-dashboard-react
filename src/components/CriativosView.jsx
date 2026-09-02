import React, { useState, useMemo } from 'react'
import TabelaCriativos from './TabelaCriativos'
import CriativosCampeoes from './CriativosCampeoes'

/* Alterna Campeões/Tabela e filtra por campanha (afeta as duas visões) */
export default function CriativosView(props) {
  const { criativos = [] } = props
  const [modo, setModo] = useState('campeoes')  // 'campeoes' | 'tabela'
  const [campanha, setCampanha] = useState('__todas__')

  const campanhas = useMemo(() => {
    const s = new Set()
    criativos.forEach(c => { if (c.campanha) s.add(c.campanha) })
    return Array.from(s).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [criativos])

  const filtrados = useMemo(
    () => (campanha === '__todas__' ? criativos : criativos.filter(c => c.campanha === campanha)),
    [criativos, campanha]
  )

  const Btn = ({ id, children }) => (
    <button onClick={() => setModo(id)}
      className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition ${
        modo === id ? 'bg-[var(--red)] text-white shadow' : 'text-[var(--tx2)] hover:text-[var(--tx)]'}`}>
      {children}
    </button>
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'var(--mid)', border: '1px solid var(--border2)' }}>
          <Btn id="campeoes">Campeões</Btn>
          <Btn id="tabela">Tabela</Btn>
        </div>

        {campanhas.length > 1 && (
          <select
            value={campanha}
            onChange={e => setCampanha(e.target.value)}
            className="h-9 px-3 rounded-xl text-[12px] font-medium outline-none max-w-[280px] truncate cursor-pointer focus:border-[var(--red)] transition"
            style={{ background: 'var(--mid)', border: '1px solid var(--border2)', color: 'var(--tx)' }}
          >
            <option value="__todas__">Todas as campanhas ({campanhas.length})</option>
            {campanhas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {modo === 'campeoes'
        ? <CriativosCampeoes {...props} criativos={filtrados} />
        : <TabelaCriativos {...props} criativos={filtrados} />}
    </div>
  )
}
