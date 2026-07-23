/**
 * DevFlow Theme Engine
 * Supports: 'dark', 'light', 'cyberpunk', 'neobrutalist'
 */

export const THEMES = [
  { id: 'dark',         name: 'Dark Charcoal',    desc: 'Traditional dark developer workspace theme.',  cardBg: '#141418', text: '#F4F4F6', sub: '#8E8E93', color: '#FF7A1A' },
  { id: 'light',        name: 'Snow Minimalist',   desc: 'Clean white styling dashboard theme.',        cardBg: '#FFFFFF', text: '#111111', sub: '#666666', color: '#FF7A1A' },
  { id: 'cyberpunk',    name: 'Cyberpunk Neon',    desc: 'Retro arcade cyberpunk borders style.',       cardBg: '#160D24', text: '#00F0FF', sub: '#B388FF', color: '#FF007F' },
  { id: 'neobrutalist', name: 'Neo-Brutalist',     desc: 'Vibrant comic colors and thick offset lines.', cardBg: '#FEF08A', text: '#000000', sub: '#1A1A1A', color: '#000000' },
]

export const applyTheme = (themeName) => {
  const validThemes = ['dark', 'light', 'cyberpunk', 'neobrutalist']
  const target = validThemes.includes(themeName) ? themeName : 'dark'
  
  validThemes.forEach(t => document.documentElement.classList.remove(`theme-${t}`))
  document.documentElement.classList.add(`theme-${target}`)
  localStorage.setItem('devflow-theme', target)
  window.dispatchEvent(new Event('themechange'))
}

export const initTheme = () => {
  const saved = localStorage.getItem('devflow-theme') || 'dark'
  applyTheme(saved)
}

export const toggleTheme = () => {
  const current = getTheme()
  const next = current === 'light' ? 'dark' : 'light'
  applyTheme(next)
}

export const getTheme = () => {
  const validThemes = ['light', 'cyberpunk', 'neobrutalist']
  for (const t of validThemes) {
    if (document.documentElement.classList.contains(`theme-${t}`)) return t
  }
  return 'dark'
}
