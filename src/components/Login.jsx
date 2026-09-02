import React, { useState } from 'react'
import { CLIENTS, ADMIN_PASS } from '../lib/clients'
import { LogoV4, IcAlerta } from '../icons'

export default function Login({ onEntrar }) {
  const [senha, setSenha]     = useState('')
  const [manter, setManter]   = useState(true)
  const [erro, setErro]       = useState('')
  const [carregando, setCarregando] = useState(false)

  function enviar(e) {
    e.preventDefault()
    setErro(''); setCarregando(true)
    setTimeout(() => {
      if (senha === ADMIN_PASS) return onEntrar({ slug: Object.keys(CLIENTS)[0], admin: true, manter })
      const achado = Object.values(CLIENTS).find(c => c.pass === senha)
      if (achado) return onEntrar({ slug: achado.slug, admin: false, manter })
      setErro('E-mail ou senha incorretos. Verifique os dados e tente novamente.')
      setCarregando(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex bg-[#0F1115]">
      {/* ══ ESQUERDA — ARTE CORPORATIVA ══ */}
      <div className="hidden lg:flex w-[52%] relative items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(150deg,#0B0C10 0%,#1A0709 55%,#2A0206 100%)' }}>

        {/* malha */}
        <div className="absolute inset-0 opacity-[.55]" style={{
          backgroundImage: 'linear-gradient(rgba(229,9,20,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(229,9,20,.05) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        {/* brilho */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 38%,rgba(229,9,20,.22),transparent 70%)' }} />
        {/* diagonais */}
        <div className="absolute -right-24 top-0 bottom-0 w-64 rotate-12 opacity-20"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(229,9,20,.5),transparent)' }} />

        <div className="relative z-10 flex flex-col items-center gap-12 px-14 w-full max-w-lg">
          <div className="flex flex-col items-center gap-6">
            <LogoV4 size={120} />
            <div className="text-center">
              <h1 className="text-[40px] font-black text-white tracking-tight leading-none">V4 Company</h1>
              <p className="text-[13px] text-white/45 mt-2 tracking-[.22em] uppercase font-medium">Dashboard de Performance</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { v: 'Tempo real', r: 'Dados ao vivo' },
              { v: '3 canais', r: 'Meta · Google · TikTok' },
              { v: '360°', r: 'Mídia + Vendas' },
            ].map(s => (
              <div key={s.r} className="text-center px-3 py-4 rounded-2xl border border-[rgba(229,9,20,.22)] bg-[rgba(229,9,20,.07)] backdrop-blur-sm">
                <div className="text-[15px] font-extrabold text-white leading-tight">{s.v}</div>
                <div className="text-[9px] text-white/35 mt-1.5 uppercase tracking-wider leading-tight">{s.r}</div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-white/25 text-center leading-relaxed max-w-sm">
            Plataforma exclusiva de inteligência de mídia paga.<br />Acesso restrito a clientes V4 Company RDR.
          </p>
        </div>
      </div>

      {/* ══ DIREITA — FORMULÁRIO ══ */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex justify-center mb-9"><LogoV4 size={60} /></div>

          <h2 className="text-[27px] font-extrabold text-[#12141A] leading-tight tracking-tight">Acessar painel</h2>
          <p className="text-[13px] text-[#5B6473] mt-1.5 mb-8">Entre com suas credenciais corporativas</p>

          {erro && (
            <div className="mb-5 px-4 py-3 rounded-xl flex items-start gap-2.5"
              style={{ background: 'rgba(229,9,20,.07)', border: '1px solid rgba(229,9,20,.25)' }}>
              <span className="text-[#E50914] mt-px shrink-0"><IcAlerta size={15} /></span>
              <p className="text-[12px] text-[#E50914] font-medium leading-relaxed">{erro}</p>
            </div>
          )}

          <form onSubmit={enviar} className="space-y-4">
            <Campo rotulo="Senha" tipo="password" valor={senha} onChange={setSenha} placeholder="••••••••" obrigatorio />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={manter} onChange={e => setManter(e.target.checked)}
                  className="w-[15px] h-[15px] rounded accent-[#E50914] cursor-pointer" />
                <span className="text-[12px] text-[#5B6473]">Manter conectado</span>
              </label>
              <button type="button" className="text-[12px] font-semibold text-[#E50914] hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" disabled={carregando}
              className="w-full py-3.5 rounded-xl bg-[#E50914] text-white text-[14px] font-bold tracking-tight hover:bg-[#C40711] active:scale-[.99] disabled:opacity-55 transition-all">
              {carregando ? 'Verificando…' : 'Entrar'}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#E6E8EC]" />
              <span className="text-[10px] font-semibold text-[#969DAA] uppercase tracking-widest">ou</span>
              <div className="flex-1 h-px bg-[#E6E8EC]" />
            </div>

            <button type="button"
              className="w-full py-3 rounded-xl border border-[#E6E8EC] text-[13px] font-semibold text-[#5B6473] hover:border-[#282C37] hover:text-[#12141A] transition-all flex items-center justify-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Entrar com SSO
            </button>
          </form>

          <p className="text-[11px] text-[#969DAA] text-center mt-9 leading-relaxed">
            Ao continuar você concorda com os termos de uso<br />e a política de privacidade da V4 Company.
          </p>
        </div>
      </div>
    </div>
  )
}

function Campo({ rotulo, tipo, valor, onChange, placeholder, obrigatorio }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[.08em] text-[#5B6473] mb-1.5">{rotulo}</label>
      <input
        type={tipo} value={valor} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={obrigatorio}
        className="w-full px-4 py-3 rounded-xl border border-[#E6E8EC] bg-[#F7F8FA] text-[13px] text-[#12141A] placeholder-[#B4BAC4] focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
      />
    </div>
  )
}
