import { useEffect, useMemo, useState, useCallback } from 'react'
import { CLIENTS_DB, ADMIN_PASS } from './lib/clients'
import { makeFmt, iso, groupMeta, groupGoogle, groupTikTok } from './lib/format'
import { fetchAll, fetchDemographics, fetchAds } from './lib/api'
import { Login } from './components/Login'
import { Sidebar } from './components/Sidebar'
import { Header, Footer } from './components/Header'
import { Overview } from './components/Overview'
import { MetaChannel, GoogleChannel, TikTokChannel, FonteChannel } from './components/Channels'
import { AdsSection } from './components/AdsSection'
import { AiSummary } from './components/AiSummary'
import { GestorHome } from './components/GestorHome'

function presetRange(id) {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  if (id === 'this_month') return [iso(new Date(y, m, 1)), iso(now)]
  if (id === 'prev_month') return [iso(new Date(y, m - 1, 1)), iso(new Date(y, m, 0))]
  if (id === '7d') { const f = new Date(now); f.setDate(f.getDate() - 6); return [iso(f), iso(now)] }
  const f = new Date(now); f.setDate(f.getDate() - 29); return [iso(f), iso(now)] // 30d
}

export default function App() {
  const slug = useMemo(() => new URLSearchParams(location.search).get('cliente') || '', [])
  const client = CLIENTS_DB[slug]

  const [authed, setAuthed] = useState(false)
  const [authErr, setAuthErr] = useState(false)
  const [section, setSection] = useState('overview')

  const [[dateFrom, dateTo], setRange] = useState(() => presetRange('30d'))
  const [pendingRange, setPendingRange] = useState([dateFrom, dateTo])
  const [preset, setPreset] = useState('30d')

  const [data, setData] = useState(null)
  const [demo, setDemo] = useState(null)
  const [adsRaw, setAdsRaw] = useState([])
  const [adsLoading, setAdsLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const fmt = useMemo(() => makeFmt(client?.moeda || 'BRL'), [client])

  // Sessão persistida por cliente
  useEffect(() => {
    if (!client) return
    try { if (sessionStorage.getItem('v4_auth_' + slug) === '1') setAuthed(true) } catch { /* ignore */ }
  }, [slug, client])

  const login = (pass) => {
    if (pass === client.pass || pass === ADMIN_PASS) {
      setAuthed(true); setAuthErr(false)
      try { sessionStorage.setItem('v4_auth_' + slug, '1') } catch { /* ignore */ }
    } else setAuthErr(true)
  }
  const logout = () => {
    setAuthed(false)
    try { sessionStorage.removeItem('v4_auth_' + slug) } catch { /* ignore */ }
  }

  const load = useCallback(async (from, to) => {
    if (!client) return
    setLoading(true)
    try {
      const d = await fetchAll(client, from, to)
      setData(d)
      fetchDemographics(client, from, to).then(setDemo).catch(() => setDemo(null))
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => { if (authed && client) load(dateFrom, dateTo) }, [authed, client]) // eslint-disable-line

  // Carrega anúncios sob demanda ao abrir a seção
  useEffect(() => {
    if (section === 'ads' && authed && client && !adsRaw.length) {
      setAdsLoading(true)
      fetchAds(client, dateFrom, dateTo).then(setAdsRaw).catch(() => setAdsRaw([])).finally(() => setAdsLoading(false))
    }
  }, [section, authed, client]) // eslint-disable-line

  const onDate = (which, val) => setPendingRange((r) => which === 'from' ? [val, r[1]] : [r[0], val])
  const onPreset = (id) => { const [f, t] = presetRange(id); setPreset(id); setPendingRange([f, t]); setRange([f, t]); setAdsRaw([]); load(f, t) }
  const onApply = () => { setPreset(''); setRange(pendingRange); setAdsRaw([]); load(pendingRange[0], pendingRange[1]) }

  // ── Sem slug → home do gestor ──
  if (!slug) return <GestorHome />

  // ── 404 cliente inexistente ──
  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="card p-8 max-w-md text-center" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="text-[16px] font-extrabold mb-2" style={{ color: 'var(--text)' }}>Cliente não encontrado</div>
          <div className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>
            O identificador <code>{slug}</code> não existe. Veja a lista de clientes na página inicial.
          </div>
          <a href="?" className="inline-block px-4 py-2 rounded-lg text-[13px] font-bold text-white" style={{ background: 'var(--red)' }}>Voltar ao início</a>
        </div>
      </div>
    )
  }

  if (!authed) return <Login client={client} onSubmit={login} error={authErr} />

  const mG = data ? groupMeta(data.meta) : []
  const gG = data ? groupGoogle(data.google) : []
  const tG = data ? groupTikTok(data.tiktok) : []
  const totalSp = mG.reduce((a, x) => a + x.sp, 0) + gG.reduce((a, x) => a + x.sp, 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Sidebar active={section} onNav={setSection} hasTikTok={client.tiktokIds?.length > 0} funilSource={client.funilSource} />
      <div style={{ marginLeft: 68 }}>
        <Header
          client={client} slug={slug}
          dateFrom={pendingRange[0]} dateTo={pendingRange[1]}
          onDate={onDate} onPreset={onPreset} onApply={onApply} activePreset={preset}
          onLogout={logout}
        />
        <main className="px-6 py-6 max-w-[1500px] mx-auto">
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <div className="w-8 h-8 rounded-full border-2 spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--red)' }} />
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-3)' }}>Carregando dados de {client.nome}…</div>
            </div>
          ) : data ? (
            <>
              {section === 'overview' && (
                <>
                  <AiSummary client={client} data={data} fmt={fmt} dateFrom={dateFrom} dateTo={dateTo} />
                  <Overview data={data} C={client} fmt={fmt} demo={demo} />
                </>
              )}
              {section === 'meta' && <MetaChannel mG={mG} fmt={fmt} tipo={client.tipo} />}
              {section === 'google' && <GoogleChannel gG={gG} fmt={fmt} />}
              {section === 'tiktok' && <TikTokChannel tG={tG} fmt={fmt} />}
              {section === 'fonte' && <FonteChannel funilSource={client.funilSource} funilSrc={data.funilSrc} totalSpend={totalSp} fmt={fmt} />}
              {section === 'ads' && <AdsSection adsRaw={adsRaw} tipo={client.tipo} fmt={fmt} loading={adsLoading} />}
            </>
          ) : null}
          <Footer />
        </main>
      </div>
    </div>
  )
}
