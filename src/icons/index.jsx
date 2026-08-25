// Ícones SVG de linha, minimalistas, monocromáticos (currentColor).
// Substituem todos os emojis do dashboard antigo.
// stroke-based, 1.6px, 24x24 viewBox, herdam a cor do texto.

const base = {
  width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
}

export const IconGrid = (p) => (<svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>)
export const IconWallet = (p) => (<svg {...base} {...p}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2"/><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3"/><path d="M20 10h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"/></svg>)
export const IconCart = (p) => (<svg {...base} {...p}><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6"/></svg>)
export const IconTarget = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>)
export const IconTicket = (p) => (<svg {...base} {...p}><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 6 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-6Z"/><path d="M13 7v10"/></svg>)
export const IconTrendUp = (p) => (<svg {...base} {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>)
export const IconTrophy = (p) => (<svg {...base} {...p}><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 6H4a2 2 0 0 0 2 4M18 6h2a2 2 0 0 1-2 4"/><path d="M9 20h6M12 14v6"/></svg>)
export const IconMessage = (p) => (<svg {...base} {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9Z"/></svg>)
export const IconClipboard = (p) => (<svg {...base} {...p}><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 12h6M9 16h4"/></svg>)
export const IconGlobe = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></svg>)
export const IconMouse = (p) => (<svg {...base} {...p}><rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3"/></svg>)
export const IconFilm = (p) => (<svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>)
export const IconLayers = (p) => (<svg {...base} {...p}><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/></svg>)
export const IconMap = (p) => (<svg {...base} {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>)
export const IconUsers = (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/></svg>)
export const IconChart = (p) => (<svg {...base} {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>)
export const IconSun = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>)
export const IconMoon = (p) => (<svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>)
export const IconLogout = (p) => (<svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>)
export const IconCalendar = (p) => (<svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>)
export const IconInfo = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>)
export const IconSearch = (p) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>)
export const IconMusic = (p) => (<svg {...base} {...p}><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>)
export const IconBriefcase = (p) => (<svg {...base} {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>)
export const IconCheck = (p) => (<svg {...base} {...p}><path d="M20 6 9 17l-5-5"/></svg>)
export const IconSparkles = (p) => (<svg {...base} {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z"/></svg>)

// Logos de plataforma (marca, monocromático branco na sidebar preta)
export const LogoV4 = (p) => (<svg viewBox="0 0 100 80" fill="none" {...p}><polygon points="15,18 50,65 85,18" fill="currentColor"/></svg>)
export const LogoMeta = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6.5 6C4 6 2.5 8.4 2.5 12s1.5 6 4 6c1.6 0 2.7-1.1 3.9-3.2.9-1.6 1.6-3 1.6-3s.9 1.7 1.7 3.1C15.4 16.9 16.5 18 18 18c2.5 0 3.5-2.4 3.5-6s-1.4-6-3.9-6c-1.6 0-2.8 1.2-4 3.4C12.8 10.7 12 12.2 12 12.2s-.7-1.4-1.5-2.8C9.3 7.1 8.1 6 6.5 6Zm0 2c.8 0 1.5.8 2.3 2.2.5.9 1 1.9 1 1.9s-.6 1.1-1.1 2C7.9 15.3 7.2 16 6.5 16 5.3 16 4.5 14.6 4.5 12s.8-4 2-4Zm11 0c1.2 0 2 1.4 2 4s-.8 4-2 4c-.7 0-1.4-.7-2.2-2-.5-.8-1-1.8-1-1.8s.5-1 1-1.9C16.1 8.8 16.8 8 17.5 8Z"/></svg>)
export const LogoGoogle = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 11v2.6h4.3c-.2 1.1-1.4 3.3-4.3 3.3-2.6 0-4.7-2.1-4.7-4.8S9.4 7.3 12 7.3c1.5 0 2.5.6 3 1.2l2-1.9C15.7 5.4 14 4.7 12 4.7 7.9 4.7 4.6 8 4.6 12s3.3 7.3 7.4 7.3c4.3 0 7.1-3 7.1-7.2 0-.5 0-.9-.1-1.1H12Z"/></svg>)
export const LogoTikTok = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.5 3c.3 2 1.5 3.5 3.5 3.8v2.6c-1.3 0-2.5-.4-3.5-1.1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .8.1v2.8a2.8 2.8 0 1 0 2 2.7V3h2.8Z"/></svg>)
