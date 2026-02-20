import { SettingsContext } from 'contexts/SettingsContext'
import { useContext, useMemo } from 'react'
import { createTheme } from '@mui/material/styles'

export const useShellTheme = () => {
  const { getUserSettings } = useContext(SettingsContext)
  const { colorMode } = getUserSettings()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          ...(colorMode === 'dark'
            ? {
              primary: {
                main: '#64748B',
                light: '#94A3B8',
                dark: '#475569',
                contrastText: '#FFFFFF',
              },
              secondary: {
                main: '#38BDF8',
                light: '#7DD3FC',
                dark: '#0284C7',
                contrastText: '#0F172A',
              },
              background: {
                default: '#0F172A',
                paper: '#1E293B',
              },
              text: {
                primary: '#E2E8F0',
                secondary: '#94A3B8',
              },
              divider: 'rgba(100, 116, 139, 0.15)',
              error: {
                main: '#F87171',
              },
              warning: {
                main: '#FBBF24',
              },
              success: {
                main: '#34D399',
              },
              info: {
                main: '#38BDF8',
              },
            }
            : {
              primary: {
                main: '#64748B',
                light: '#94A3B8',
                dark: '#475569',
                contrastText: '#FFFFFF',
              },
              secondary: {
                main: '#0284C7',
                light: '#38BDF8',
                dark: '#0369A1',
                contrastText: '#FFFFFF',
              },
              background: {
                default: '#F8FAFC',
                paper: '#FFFFFF',
              },
              text: {
                primary: '#0F172A',
                secondary: '#64748B',
              },
              divider: 'rgba(100, 116, 139, 0.12)',
            }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 800, letterSpacing: '-0.02em' },
          h2: { fontWeight: 700, letterSpacing: '-0.01em' },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          body1: { fontWeight: 400, lineHeight: 1.6 },
          body2: { fontWeight: 400, lineHeight: 1.5 },
          button: {
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'none' as const,
          },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(56, 189, 248, 0.25)',
                },
              },
              containedPrimary: {
                background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                },
              },
            },
          },
          MuiFab: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.05)' },
              },
              primary: {
                background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.3s ease',
                  ...(colorMode === 'dark' && {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                  }),
                  '&:hover': {
                    ...(colorMode === 'dark' && {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }),
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 2px rgba(56, 189, 248, 0.25)',
                    ...(colorMode === 'dark' && {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }),
                  },
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                ...(colorMode === 'dark' && {
                  backgroundImage: 'none',
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(100, 116, 139, 0.1)',
                }),
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                ...(colorMode === 'dark' && {
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRight: '1px solid rgba(100, 116, 139, 0.1)',
                }),
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                ...(colorMode === 'dark' && {
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(20px)',
                  borderBottom: '1px solid rgba(100, 116, 139, 0.1)',
                }),
                boxShadow: 'none',
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px !important',
                textTransform: 'none' as const,
                fontWeight: 500,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  '&:hover': {
                    backgroundColor: 'rgba(56, 189, 248, 0.25)',
                  },
                },
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                borderRadius: 8,
                fontSize: '0.8rem',
                ...(colorMode === 'dark' && {
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(100, 116, 139, 0.15)',
                }),
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                ...(colorMode === 'dark' && {
                  borderColor: 'rgba(100, 116, 139, 0.1)',
                }),
              },
            },
          },
        },
      }),
    [colorMode]
  )

  return theme
}
