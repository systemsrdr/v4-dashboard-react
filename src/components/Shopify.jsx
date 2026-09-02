import React from 'react'
import { Card } from './ui'
import { IcShopify } from '../icons'

/* Shopify ainda não conectado — placeholder até a integração ser ativada */
export default function Shopify({ cliente }) {
  return (
    <Card>
      <div className="py-16 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl grid place-items-center"
          style={{ background: 'var(--red-soft)', color: 'var(--red)' }}>
          <IcShopify size={28} />
        </div>
        <h3 className="text-[17px] font-extrabold text-[var(--tx-card)]">Shopify ainda não conectado</h3>
        <p className="text-[13px] text-[var(--tx-card2)] max-w-[440px] leading-relaxed">
          A integração da Shopify de <b>{cliente.nome}</b> será ativada em breve. Quando conectada,
          as vendas e a receita da loja aparecerão aqui e no funil da Visão Geral.
        </p>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
          Em breve
        </span>
      </div>
    </Card>
  )
}
