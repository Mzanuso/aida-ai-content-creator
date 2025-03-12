import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  
  // Controlla il tema preferito del sistema e imposta darkMode di conseguenza
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDarkMode)
  }, [])
  
  // Aggiorna il tema quando cambia darkMode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])
  
  function toggleDarkMode() {
    setDarkMode(prevMode => !prevMode)
  }
  
  const value = {
    darkMode,
    toggleDarkMode
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}