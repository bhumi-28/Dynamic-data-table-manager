"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from '../src/store'
import { setColumns } from '../src/store/slices/columnsSlice'
import Header from '../src/components/Header'

export function Providers({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem('theme')
      setDark(v === 'dark')
    } catch {}
  }, [])

  // load persisted columns on client after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const cols = localStorage.getItem('columns')
      if (cols) {
        const parsed = JSON.parse(cols)
        store.dispatch(setColumns(parsed))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
    try {
      if (dark) document.body.classList.add('theme-dark')
      else document.body.classList.remove('theme-dark')
    } catch {}
  }, [dark])

  const theme = useMemo(() => createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      ...(dark ? {
        background: { default: '#0f1720', paper: '#0b1220' },
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        text: { primary: '#e6eef8', secondary: '#9fb4c8' },
      } : {
        background: { default: '#f6f8fa', paper: '#ffffff' },
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        text: { primary: '#0b1b2b', secondary: '#405b73' },
      })
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.6)' : '0 1px 3px rgba(0,0,0,0.1)' }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: { transition: 'background-color 160ms ease' }
        }
      }
    }
  }), [dark])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Header />
        {/* Fixed theme toggle button in the top-right corner */}
        <button
          aria-label="Toggle theme"
          onClick={() => setDark(d => !d)}
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1400,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            color: 'var(--mui-palette-text-primary, inherit)'
          }}
        >
          {dark ? '🌞' : '🌙'}
        </button>
        {children}
      </ThemeProvider>
    </Provider>
  )
}
