import React, { useState } from 'react'
import TabelaCriativos from './TabelaCriativos'
import CriativosCampeoes from './CriativosCampeoes'

/* Alterna entre a galeria "Campeões" e a "Tabela" — mantém as duas. */
export default function CriativosView(props) {
  const [modo, setModo] = useState('campeoes') // 'campeoes' | 'tabela'

  const Btn = ({ id, children }) => (
    <button onClick={() => setModo(id)}
      className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition ${
        modo === id ? 'bg-[var(--red)] text-white shadow' : 'text-[var(--tx2)] hover:text-[var(--tx)]'}`}>
      {children}
    </button>
  )

  return (
    <div>
      <div className="flex items-center gap-1 mb-3 p-1 rounded-xl w-fit"
        style={{ background: 'var(--mid)', border: '1px solid var(--border2)' }}>
        <Btn id="campeoes">Campeões</Btn>
        <Btn id="tabela">Tabela</Btn>
      </div>

      {modo === 'campeoes'
        ? <CriativosCampeoes {...props} />
        : <TabelaCriativos {...props} />}
    </div>
  )
}
