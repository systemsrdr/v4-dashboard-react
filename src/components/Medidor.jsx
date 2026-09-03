import React from 'react'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function Medidor({ valor = 0, max = 100, rotulo, texto, cor = '#E50914' }) {
  const v = Math.max(0, Math.min(valor, max || 1))
  return (
    <div className="flex flex-col items-center">
      <div className="w-full" style={{ height: 112 }}>
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="82%" innerRadius="70%" outerRadius="100%"
            startAngle={180} endAngle={0} data={[{ v }]} barSize={15}>
            <PolarAngleAxis type="number" domain={[0, max || 1]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#EDEFF3' }} dataKey="v" cornerRadius={8} fill={cor} angleAxisId={0} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-9 text-center">
        <div className="text-[21px] font-extrabold leading-none" style={{ color: 'var(--tx-card)' }}>{texto}</div>
        <div className="text-[9.5px] font-bold uppercase tracking-wide mt-1" style={{ color: 'var(--tx-card3)' }}>{rotulo}</div>
      </div>
    </div>
  )
}
