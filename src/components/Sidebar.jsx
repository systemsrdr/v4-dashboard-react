import React, { useState, useRef, useEffect } from 'react'
import { listClients } from '../lib/clients'
import {
  LogoV4, IcVisaoGeral, IcCriativos, IcConectores, IcConfig, IcSair,
  IcChevron, IcUpload, IcMeta, IcGoogle, IcTikTok, IcShopify,
} from '../icons'

const MENU = [
  { id: 'visao-geral', rotulo: 'Visão Geral',  Icone: IcVisaoGeral },
  { id: 'meta',        rotulo: 'Meta Ads',     Icone: IcMeta },
  { id: 'google',      rotulo: 'Google Ads',   Icone: IcGoogle },
  { id: 'tiktok',      rotulo: 'TikTok Ads',   Icone: IcTikTok },
  { id: 'shopify',     rotulo: 'Shopify',      Icone: IcShopify },
  { id: 'anuncios',    rotulo: 'Anúncios',     Icone: IcCriativos },
  { id: 'conectores',  rotulo: 'Conectores',   Icone: IcConectores },
  { id: 'config',      rotulo: 'Configurações',Icone: IcConfig },
]

/* Logo do cliente persistida em localStorage por slug */
const chaveLogo = slug => `v4-logo:${slug}`

export default function Sidebar({ secao, onSecao, cliente, onCliente, onSair, recolhida, onRecolher }) {
  const [seletorAberto, setSeletorAberto] = useState(false)
  const [logo, setLogo] = useState(null)
  const [arrastando, setArrastando] = useState(false)
  const inputRef = useRef()
  const clientes = listClients()

  useEffect(() => { setLogo(localStorage.getItem(chaveLogo(cliente.slug))) }, [cliente.slug])

  function processarArquivo(file) {
    if (!file) return
    const ok = file.type === 'image/svg+xml' || /\.(svg|png|jpe?g|webp)$/i.test(file.name)
    if (!ok) return
    const leitor = new FileReader()
    leitor.onload = () => {
      const dado = leitor.result
      localStorage.setItem(chaveLogo(cliente.slug), dado)
      setLogo(dado)
    }
    leitor.readAsDataURL(file)
  }

  function removerLogo() {
    localStorage.removeItem(chaveLogo(cliente.slug))
    setLogo(null)
  }

  /* itens de menu filtrados pelo tipo de negócio do cliente */
  const menuVisivel = MENU.filter(m => !m.tipo || m.tipo === cliente.tipo)

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 flex flex-col bg-[#0B0C10] border-r border-[var(--border2)] transition-[width] duration-200"
      style={{ width: recolhida ? 60 : 200 }}
    >
      {/* ── Logo V4 + recolher ── */}
      <div className="flex items-center gap-2.5 px-3.5 h-[58px] border-b border-[var(--border2)] shrink-0">
        <LogoV4 size={recolhida ? 30 : 32} />
        {!recolhida && (
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-extrabold text-white leading-none tracking-tight">V4 Company</div>
            <div className="text-[9px] text-white/35 uppercase tracking-[.14em] mt-1">Performance</div>
          </div>
        )}
        <button onClick={onRecolher}
          className="text-white/30 hover:text-white transition-colors shrink-0"
          title={recolhida ? 'Expandir' : 'Recolher'}>
          <IcChevron dir={recolhida ? 'right' : 'left'} size={15} />
        </button>
      </div>

      {/* ── SLOT DE LOGO DO CLIENTE ── */}
      <div className="px-3 pt-4 pb-3 border-b border-[var(--border2)] shrink-0">
        {!recolhida && (
          <div className="text-[9px] font-bold uppercase tracking-[.13em] text-white/25 mb-2 px-1">Logo do cliente</div>
        )}
        <div
          onDragOver={e => { e.preventDefault(); setArrastando(true) }}
          onDragLeave={() => setArrastando(false)}
          onDrop={e => { e.preventDefault(); setArrastando(false); processarArquivo(e.dataTransfer.files?.[0]) }}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-xl cursor-pointer transition-all flex items-center justify-center overflow-hidden group ${
            arrastando ? 'border-2 border-dashed border-[var(--red)] bg-[rgba(229,9,20,.08)]'
                       : 'border border-dashed border-white/12 hover:border-[var(--red)] bg-white/[.03]'
          }`}
          style={{ height: recolhida ? 40 : 64 }}
          title="Arraste ou clique para enviar a logo em SVG"
        >
          {logo ? (
            <>
              <img src={logo} alt="Logo do cliente" className="max-h-[80%] max-w-[85%] object-contain" />
              {!recolhida && (
                <button
                  onClick={e => { e.stopPropagation(); removerLogo() }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/60 text-white/70 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--red)] hover:text-white"
                >×</button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-white/25 group-hover:text-[var(--red)] transition-colors">
              <IcUpload size={recolhida ? 14 : 17} />
              {!recolhida && <span className="text-[9px] font-semibold tracking-wide">Enviar SVG</span>}
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp"
          className="hidden" onChange={e => processarArquivo(e.target.files?.[0])} />
      </div>

      {/* ── SELETOR MULTICLIENTE ── */}
      <div className="relative px-2.5 py-3 border-b border-[var(--border2)] shrink-0">
        <button onClick={() => setSeletorAberto(o => !o)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[.05] transition-colors">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0"
            style={{ background: cliente.cor }}>{cliente.sigla}</span>
          {!recolhida && (
            <>
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-[12px] font-bold text-white truncate">{cliente.nome}</span>
                <span className="block text-[9px] text-white/35 truncate">{cliente.segmento}</span>
              </span>
              <span className={`text-white/30 shrink-0 transition-transform ${seletorAberto ? 'rotate-180' : ''}`}>
                <IcChevron size={13} />
              </span>
            </>
          )}
        </button>

        {seletorAberto && (
          <div className={`absolute z-50 bg-[#15171E] border border-[var(--border2)] rounded-xl overflow-hidden shadow-lift ${
            recolhida ? 'left-full ml-2 top-3 w-60' : 'left-2.5 right-2.5 top-full mt-1'
          }`}>
            {clientes.map(c => (
              <button key={c.slug}
                onClick={() => { onCliente(c.slug); setSeletorAberto(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                  c.slug === cliente.slug ? 'bg-[rgba(229,9,20,.13)]' : 'hover:bg-white/[.05]'
                }`}>
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white shrink-0"
                  style={{ background: c.cor }}>{c.sigla}</span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold text-white truncate">{c.nome}</span>
                  <span className="block text-[9px] text-white/35 truncate">
                    {c.tipo === 'ecommerce' ? 'E-commerce' : 'Inside Sales'} · {c.moeda === 'EUR' ? '€' : 'R$'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── NAVEGAÇÃO ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {menuVisivel.map(({ id, rotulo, Icone }) => {
          const on = secao === id
          return (
            <button key={id} onClick={() => onSecao(id)} title={recolhida ? rotulo : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all border ${
                on ? 'bg-[rgba(229,9,20,.13)] text-[var(--red-2)] border-[rgba(229,9,20,.3)]'
                   : 'text-white/45 hover:text-white hover:bg-white/[.05] border-transparent'
              }`}>
              <span className="shrink-0"><Icone size={16} /></span>
              {!recolhida && <span className="text-[12px] font-semibold truncate">{rotulo}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── SAIR ── */}
      <div className="px-2.5 pb-4 pt-2 border-t border-[var(--border2)] shrink-0">
        <button onClick={onSair} title={recolhida ? 'Sair' : undefined}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-white/35 hover:text-[var(--red-2)] hover:bg-[rgba(229,9,20,.09)] transition-all">
          <span className="shrink-0"><IcSair size={16} /></span>
          {!recolhida && <span className="text-[12px] font-semibold">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
