import { useState } from 'react'
import { CLIENTS_DB, ADMIN_PASS } from '../lib/clients'
import { LogoV4, IconGlobe, IconCart, IconTarget } from '../icons'
import { ThemeToggle } from './ui'

const FONTE_LABEL = { kommo: 'Kommo', shopify: 'Shopify', tray: 'Tray' }

// Home do gestor: pede senha admin, depois mostra o grid de clientes.
export function GestorHome() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem('v4_gestor') === '1' } catch { return false }
  })
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)

  const login = (e) => {
    e.preventDefault()
    if (pass === ADMIN_PASS) {
      setAuthed(true)
      try { sessionStorage.setItem('v4_gestor', '1') } catch { /* ignore */ }
    } else setErr(true)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="card w-full max-w-sm p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex flex-col items-center text-center mb-6">
            <span className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: 'var(--red)' }}>
              <LogoV4 width={30} height={23} style={{ color: '#fff' }} />
            </span>
            <div className="text-[18px] font-extrabold" style={{ color: 'var(--text)' }}>V4 Performance</div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--text-3)' }}>Área do gestor</div>
          </div>
          <form onSubmit={login}>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus placeholder="Senha do gestor"
              className="w-full mb-3 rounded-lg border px-3 py-2.5 text-[14px]" style={{ background: 'var(--surface-2)', borderColor: err ? 'var(--red)' : 'var(--border)', color: 'var(--text)' }} />
            {err && <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--red)' }}>Senha incorreta.</div>}
            <button type="submit" className="w-full py-2.5 rounded-lg text-[14px] font-bold text-white" style={{ background: 'var(--red)' }}>Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  const clients = Object.entries(CLIENTS_DB)
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="flex items-center gap-3 px-6 border-b" style={{ height: 60, background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <span className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: 'var(--red)' }}>
          <LogoV4 width={18} height={14} style={{ color: '#fff' }} />
        </span>
        <div className="text-[14px] font-extrabold" style={{ color: 'var(--text)' }}>V4 Performance <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>· Gestor</span></div>
        <div className="ml-auto"><ThemeToggle /></div>
      </header>
      <main className="px-6 py-8 max-w-[1300px] mx-auto">
        <div className="text-[20px] font-extrabold mb-1" style={{ color: 'var(--text)' }}>Clientes</div>
        <div className="text-[13px] mb-6" style={{ color: 'var(--text-3)' }}>{clients.length} contas · clique para abrir o dashboard</div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {clients.map(([slug, c]) => (
            <a key={slug} href={`?cliente=${slug}`} className="card p-5 transition-transform hover:-translate-y-0.5" style={{ boxShadow: 'var(--shadow)', textDecoration: 'none' }}>
              <div className="flex items-center gap-2 mb-2">
                {c.tipo === 'ec' ? <IconCart width={16} height={16} style={{ color: 'var(--red)' }} /> : <IconTarget width={16} height={16} style={{ color: 'var(--red)' }} />}
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>{c.tipo === 'ec' ? 'E-commerce' : 'Inside Sales'}</span>
                {c.moeda === 'EUR' && <span className="text-[10px] font-bold ml-auto" style={{ color: '#9333EA' }}>EUR</span>}
              </div>
              <div className="text-[15px] font-extrabold mb-0.5" style={{ color: 'var(--text)' }}>{c.nome}</div>
              <div className="text-[12px] mb-3" style={{ color: 'var(--text-3)' }}>{c.seg || '—'}</div>
              <div className="flex flex-wrap gap-1.5">
                {c.metaIds.length > 0 && <Tag>Meta</Tag>}
                {c.googleIds.length > 0 && <Tag>Google</Tag>}
                {c.tiktokIds.length > 0 && <Tag>TikTok</Tag>}
                {c.funilSource && <Tag accent>{FONTE_LABEL[c.funilSource]}</Tag>}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

function Tag({ children, accent }) {
  return (
    <span className="text-[10px] font-bold px-2 py-1 rounded" style={accent
      ? { background: 'var(--red-2)', color: 'var(--red)' }
      : { background: 'var(--surface-3)', color: 'var(--text-2)' }}>{children}</span>
  )
}
