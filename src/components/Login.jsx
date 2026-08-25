import { useState } from 'react'
import { LogoV4 } from '../icons'
import { ThemeToggle } from './ui'

// Tela de login por senha. Aceita a senha do cliente ou a senha admin (AdminM).
export function Login({ client, onSubmit, error }) {
  const [pass, setPass] = useState('')
  const submit = (e) => {
    e.preventDefault()
    onSubmit(pass)
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="card w-full max-w-sm p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex flex-col items-center text-center mb-6">
          <span className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: 'var(--red)' }}>
            <LogoV4 width={30} height={23} style={{ color: '#fff' }} />
          </span>
          <div className="text-[18px] font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>V4 Performance</div>
          <div className="text-[12px] mt-1" style={{ color: 'var(--text-3)' }}>
            {client ? client.nome : 'Painel de performance'}
          </div>
        </div>
        <form onSubmit={submit}>
          <label className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>Senha de acesso</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
            className="w-full mt-1.5 mb-3 rounded-lg border px-3 py-2.5 text-[14px]"
            style={{ background: 'var(--surface-2)', borderColor: error ? 'var(--red)' : 'var(--border)', color: 'var(--text)' }}
            placeholder="••••••••"
          />
          {error && <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--red)' }}>Senha incorreta. Tente novamente.</div>}
          <button type="submit" className="w-full py-2.5 rounded-lg text-[14px] font-bold text-white" style={{ background: 'var(--red)' }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
