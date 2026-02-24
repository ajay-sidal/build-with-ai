// Theme token mapping to CSS variables
export const tokens = {
  colors: {
    bgPrimary: 'var(--bg-primary)',
    bgSecondary: 'var(--bg-secondary)',
    textPrimary: 'var(--text-primary)',
    accentCyan: 'var(--accent-cyan)',
    accentBlue: 'var(--accent-blue)',
    accentPurple: 'var(--accent-purple)',
  },
  radii: {
    lg: '16px',
    md: '8px',
  },
  spacing: {
    sm: '8px',
    md: '16px',
  },
}

export function setThemeVariable(key: string, value: string) {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(key, value)
    }
  } catch (e) {
    // noop
  }
}
