import { SettingsContext } from 'contexts/SettingsContext'
import { useContext, useMemo } from 'react'
import { createTheme } from '@mui/material/styles'

export const useShellTheme = () => {
  const { getUserSettings } = useContext(SettingsContext)
  const { colorMode } = getUserSettings()

  const isDark = colorMode === 'dark'

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          primary: {
            main: isDark ? '#94A3B8' : '#475569',
            light: isDark ? '#CBD5E1' : '#64748B',
            dark: isDark ? '#64748B' : '#334155',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#38BDF8',
            light: '#7DD3FC',
            dark: '#0284C7',
            contrastText: isDark ? '#0F172A' : '#FFFFFF',
          },
          background: {
            default: isDark ? '#0F172A' : '#F1F5F9',
            paper: isDark ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: isDark ? '#E2E8F0' : '#1E293B',
            secondary: isDark ? '#94A3B8' : '#64748B',
          },
          divider: isDark
            ? 'rgba(148, 163, 184, 0.12)'
            : 'rgba(100, 116, 139, 0.15)',
          error: {
            main: isDark ? '#F87171' : '#EF4444',
          },
          warning: {
            main: isDark ? '#FBBF24' : '#F59E0B',
          },
          success: {
            main: isDark ? '#34D399' : '#10B981',
          },
          info: {
            main: '#38BDF8',
          },
          action: {
            hover: isDark
              ? 'rgba(148, 163, 184, 0.08)'
              : 'rgba(100, 116, 139, 0.06)',
            selected: isDark
              ? 'rgba(56, 189, 248, 0.12)'
              : 'rgba(56, 189, 248, 0.10)',
          },
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
                  boxShadow: isDark
                    ? '0 4px 20px rgba(56, 189, 248, 0.2)'
                    : '0 4px 20px rgba(71, 85, 105, 0.2)',
                },
              },
              containedPrimary: {
                background: isDark
                  ? 'linear-gradient(135deg, #475569 0%, #64748B 100%)'
                  : 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                color: '#FFFFFF',
                '&:hover': {
                  background: isDark
                    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                    : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
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
                background: isDark
                  ? 'linear-gradient(135deg, #475569 0%, #64748B 100%)'
                  : 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                color: '#FFFFFF',
                '&:hover': {
                  background: isDark
                    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                    : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
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
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(241, 245, 249, 0.6)',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(241, 245, 249, 0.9)',
                  },
                  '&.Mui-focused': {
                    boxShadow: isDark
                      ? '0 0 0 2px rgba(56, 189, 248, 0.25)'
                      : '0 0 0 2px rgba(71, 85, 105, 0.2)',
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : '#FFFFFF',
                  },
                  ...(isDark && {
                    backdropFilter: 'blur(10px)',
                  }),
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                ...(isDark
                  ? {
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                  }
                  : {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }),
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                ...(isDark
                  ? {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.08)',
                  }
                  : {
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E2E8F0',
                  }),
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                ...(isDark
                  ? {
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                  }
                  : {
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E2E8F0',
                    color: '#1E293B',
                  }),
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
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.15)'
                    : 'rgba(71, 85, 105, 0.12)',
                  color: isDark ? '#38BDF8' : '#475569',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(56, 189, 248, 0.25)'
                      : 'rgba(71, 85, 105, 0.18)',
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
                ...(isDark
                  ? {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                  }
                  : {
                    backgroundColor: '#334155',
                    color: '#F1F5F9',
                  }),
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: isDark
                  ? 'rgba(148, 163, 184, 0.08)'
                  : 'rgba(226, 232, 240, 0.8)',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: '2px 8px',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(148, 163, 184, 0.08)'
                    : 'rgba(100, 116, 139, 0.06)',
                },
                '&.Mui-selected': {
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.1)'
                    : 'rgba(71, 85, 105, 0.08)',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'rgba(71, 85, 105, 0.12)',
                  },
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                ...(isDark
                  ? {
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                  }
                  : {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                  }),
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 10,
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                '&.Mui-checked': {
                  color: '#38BDF8',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#38BDF8',
                  },
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(148, 163, 184, 0.1)'
                    : 'rgba(100, 116, 139, 0.08)',
                },
              },
            },
          },
        },
      }),
    [colorMode, isDark]
  )

  return theme
}
