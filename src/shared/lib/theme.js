export const initTheme = () => {
  const saved = localStorage.getItem('devflow-theme')
  const dark = saved === null ? true : saved === 'dark'
  if (dark) {
    document.documentElement.classList.remove('theme-light')
    document.documentElement.classList.add('theme-dark')
  } else {
    document.documentElement.classList.remove('theme-dark')
    document.documentElement.classList.add('theme-light')
  }
}

export const toggleTheme = () => {
  const isLight = document.documentElement.classList.contains('theme-light')
  if (isLight) {
    document.documentElement.classList.remove('theme-light')
    document.documentElement.classList.add('theme-dark')
    localStorage.setItem('devflow-theme', 'dark')
  } else {
    document.documentElement.classList.remove('theme-dark')
    document.documentElement.classList.add('theme-light')
    localStorage.setItem('devflow-theme', 'light')
  }
  window.dispatchEvent(new Event('themechange'))
}

export const getTheme = () => {
  return document.documentElement.classList.contains('theme-light') ? 'light' : 'dark'
}
