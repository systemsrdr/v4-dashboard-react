import React from 'react'
import { Card, Bloco, Grid } from './ui'
import { useTheme } from '../hooks/useTheme'
import { IcConfig, IcSol, IcLua } from '../icons'

export default function Configuracoes({ cliente }) {
  const { tema, alternar } = useTheme()

  const info = [
    ['Nome do cliente', cliente.nome],
    ['Segmento', cliente.segmento],
    ['Tipo de negócio', cliente.tipo === 'ecommerce' ? 'E-commerce' : 'Inside Sales'],
    ['Moeda das métricas', cliente.moeda === 'EUR' ? 'Euro (€)' : 'Real (R$)'],
    ['Origem de vendas', { kommo: 'Kommo CRM', tray: 'Tray', shopify: 'Shopify' }[cliente.vendaSource]],
    ['Identificador', cliente.slug],
  ]

  return (
    <>
      <Bloco titulo="Dados do cliente" icone={IcConfig}>
        <Card pad={false}>
          <div className="divide-y divide-[var(--card-line)]">
            {info.map(([r, v]) => (
              <div key={r} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <span className="text-[12px] text-[var(--tx-card2)]">{r}</span>
                <span className="text-[12px] font-semibold text-[var(--tx-card)] text-right">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </Bloco>

      <Bloco titulo="Aparência">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[13px] font-bold text-[var(--tx-card)] mb-1">Tema da interface</h4>
              <p className="text-[12px] text-[var(--tx-card2)]">
                Atualmente em modo {tema === 'dark' ? 'escuro' : 'claro'}. A preferência fica salva neste navegador.
              </p>
            </div>
            <button onClick={alternar}
              className="flex items-center gap-2 text-[12px] font-bold px-4 py-2.5 rounded-xl border border-[var(--card-line)] text-[var(--tx-card)] hover:border-[var(--red)] hover:text-[var(--red)] transition-all shrink-0">
              {tema === 'dark' ? <IcSol size={14} /> : <IcLua size={14} />}
              Mudar para {tema === 'dark' ? 'claro' : 'escuro'}
            </button>
          </div>
        </Card>
      </Bloco>

      <Bloco titulo="Logo do cliente">
        <Card>
          <p className="text-[12px] text-[var(--tx-card2)] leading-relaxed">
            Para trocar a logo exibida no topo da barra lateral, arraste um arquivo SVG (ou PNG) sobre a área
            pontilhada no menu lateral, ou clique nela para selecionar um arquivo. A logo fica salva neste
            navegador e é aplicada apenas ao cliente selecionado.
          </p>
        </Card>
      </Bloco>
    </>
  )
}
