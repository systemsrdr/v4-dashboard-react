import React from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const S = ({ children, size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...p}>{children}</svg>
)

/* ── LOGO V4 ── */
export const LogoV4 = ({ size = 40, mono = false }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" fill="none">
    <rect width="100" height="80" rx="15" fill={mono ? 'currentColor' : '#E50914'} />
    <polygon points="15,17 43,64 71,17" fill="#fff" />
    <path d="M74 17v28h-9v10h9v8h11v-8h6V45h-6V17z" fill="#fff" />
  </svg>
)

/* ── NAVEGAÇÃO ── */
export const IcVisaoGeral = p => <S {...p}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></S>
export const IcEcommerce  = p => <S {...p}><path d="M3 4h2l2.5 11h10L20 7H6" /><circle cx="9.5" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></S>
export const IcInsideSales= p => <S {...p}><path d="M3 5h18M6 10h12M9 15h6M11 20h2" /></S>
export const IcCriativos  = p => <S {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.8" /><path d="M21 15l-5-5L5 21" /></S>
export const IcConectores = p => <S {...p}><path d="M9 7V4M15 7V4M7 7h10v5a5 5 0 0 1-10 0z" /><path d="M12 17v3" /></S>
export const IcConfig     = p => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6 2 2 0 1 1 14 4.6a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4z" /></S>

/* ── AÇÕES / KPI ── */
export const IcSair       = p => <S {...p}><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9" /></S>
export const IcChevron    = ({ dir = 'down', ...p }) => <S {...p}><path d={dir === 'down' ? 'M6 9l6 6 6-6' : dir === 'up' ? 'M6 15l6-6 6 6' : dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} /></S>
export const IcSol        = p => <S {...p}><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></S>
export const IcLua        = p => <S {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></S>
export const IcInvest     = p => <S {...p}><rect x="2" y="6" width="20" height="13" rx="2" /><circle cx="12" cy="12.5" r="2.5" /><path d="M6 10v5M18 10v5" /></S>
export const IcReceita    = p => <S {...p}><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></S>
export const IcRoas       = p => <S {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></S>
export const IcTicket     = p => <S {...p}><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2.5 2.5 0 0 0 0 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-5z" /><path d="M12 6v3M12 13v3" /></S>
export const IcCpa        = p => <S {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></S>
export const IcVendas     = p => <S {...p}><path d="M6 2 3 6v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></S>
export const IcMensagem   = p => <S {...p}><path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 21l2.4-6.4A8 8 0 1 1 21 11.5z" /></S>
export const IcLead       = p => <S {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></S>
export const IcImpressao  = p => <S {...p}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></S>
export const IcClique     = p => <S {...p}><path d="M9 3v10.5l2.7-2.2 2 4.6 2.4-1-2-4.5 3.4-.6z" /></S>
export const IcUpload     = p => <S {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v13" /></S>
export const IcRaio       = p => <S {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></S>
export const IcAlerta     = p => <S {...p}><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></S>

/* ── PLATAFORMAS (monocromático, sem azul) ── */
export const IcMeta = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 5C3.6 5 2 7.9 2 11.4c0 3.3 1.5 5.6 4 5.6 1.9 0 3.1-1.3 4.6-3.9l1-1.7c.3-.6.6-1 .9-1.5.3.5.6.9.9 1.5l1 1.7c1.5 2.6 2.7 3.9 4.6 3.9 2.5 0 4-2.3 4-5.6C22 7.9 20.4 5 17.5 5c-1.7 0-3 1-4.4 2.9l-1.1 1.6-1.1-1.6C9.5 6 8.2 5 6.5 5zm0 2c1 0 1.9.8 3.1 2.5l.9 1.4-.9 1.5C8.4 14.2 7.5 15 6.5 15c-1.3 0-2.2-1.4-2.2-3.6C4.3 8.9 5.2 7 6.5 7zm11 0c1.3 0 2.2 1.9 2.2 4.4 0 2.2-.9 3.6-2.2 3.6-1 0-1.9-.8-3.1-2.6l-.9-1.5.9-1.4C15.6 7.8 16.5 7 17.5 7z" />
  </svg>
)
export const IcGoogle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 11v2.8h4c-.2 1.1-1.3 3.2-4 3.2-2.4 0-4.4-2-4.4-4.5S9.6 8 12 8c1.4 0 2.3.6 2.8 1.1l1.9-1.9C15.5 6.1 13.9 5.5 12 5.5 8.1 5.5 5 8.6 5 12.5s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2z" />
  </svg>
)
export const IcTikTok = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 3c.4 2 1.6 3.4 3.8 3.6v2.5c-1.3.1-2.5-.3-3.8-1.1v5.6c0 4.6-4.3 6.9-7.8 5.1-2.3-1.2-3.1-4-2.4-6.2.7-2.1 2.9-3.4 5.4-3v2.7c-.3.1-.7.2-1 .3-1.1.4-1.7 1.1-1.5 2.1.2 1 1.2 1.6 2.3 1.5 1.1-.1 1.8-.9 1.8-2.1V3z" />
  </svg>
)
export const IcKommo = p => <S {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 9h10M7 13h6" /></S>
export const IcShopify = p => <S {...p}><path d="M6 2 3 6v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /></S>

export const canalIcone = c => ({ meta: IcMeta, google: IcGoogle, tiktok: IcTikTok }[c] || IcRaio)
export const canalNome  = c => ({ meta: 'Meta Ads', google: 'Google Ads', tiktok: 'TikTok Ads' }[c] || c)
