import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext({ tema: 'dark', alternar: () => {} })

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('v4-tema') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', tema === 'light')
    document.documentElement.classList.toggle('dark', tema === 'dark')
    localStorage.setItem('v4-tema', tema)
  }, [tema])

  return (
    <Ctx.Provider value={{ tema, alternar: () => setTema(t => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
