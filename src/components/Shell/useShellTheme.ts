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
            main: isDark ? '#FFFFFF' : '#171717',
            light: isDark ? '#FFFFFF' : '#404040',
            dark: isDark ? '#D4D4D4' : '#000000',
            contrastText: isDark ? '#000000' : '#FFFFFF',
          },
          secondary: {
            main: isDark ? '#A3A3A3' : '#737373',
            light: isDark ? '#D4D4D4' : '#A3A3A3',
            dark: isDark ? '#737373' : '#525252',
          },
          background: {
            default: isDark ? '#0A0A0A' : '#FFFFFF',
            paper: isDark ? '#141414' : '#FFFFFF',
          },
          text: {
            primary: isDark ? '#E5E5E5' : '#171717',
            secondary: isDark ? '#737373' : '#737373',
          },
          divider: isDark ? '#262626' : '#E5E5E5',
          error: { main: '#DC2626' },
          warning: { main: '#D97706' },
          success: { main: '#525252' },
          info: { main: '#525252' },
          action: {
            hover: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            selected: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        },
        typography: {
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontWeight: 700, letterSpacing: '-0.02em' },
          h2: { fontWeight: 700, letterSpacing: '-0.02em' },
          h3: { fontWeight: 600, letterSpacing: '-0.01em' },
          h4: { fontWeight: 600, letterSpacing: '-0.01em' },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          body1: { lineHeight: 1.6 },
          body2: { lineHeight: 1.5 },
          button: {
            fontWeight: 500,
            textTransform: 'none' as const,
          },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 20px',
                fontSize: '0.875rem',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              },
              containedPrimary: {
                backgroundColor: isDark ? '#FFFFFF' : '#171717',
                color: isDark ? '#000000' : '#FFFFFF',
                '&:hover': {
                  backgroundColor: isDark ? '#E5E5E5' : '#404040',
                },
              },
              outlinedPrimary: {
                borderColor: isDark ? '#404040' : '#D4D4D4',
                color: isDark ? '#E5E5E5' : '#171717',
                '&:hover': {
                  borderColor: isDark ? '#737373' : '#A3A3A3',
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
              },
            },
          },
          MuiFab: {
            styleOverrides: {
              root: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
              primary: {
                backgroundColor: isDark ? '#FFFFFF' : '#171717',
                color: isDark ? '#000000' : '#FFFFFF',
                '&:hover': {
                  backgroundColor: isDark ? '#E5E5E5' : '#404040',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  '& fieldset': {
                    borderColor: isDark ? '#262626' : '#D4D4D4',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? '#404040' : '#A3A3A3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDark ? '#FFFFFF' : '#171717',
                    borderWidth: 1,
                  },
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: isDark ? '#141414' : '#FFFFFF',
                border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
                boxShadow: 'none',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
                borderRight: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
                borderBottom: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
                color: isDark ? '#E5E5E5' : '#171717',
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px !important',
                textTransform: 'none' as const,
                fontWeight: 500,
                borderColor: isDark ? '#262626' : '#D4D4D4',
                '&.Mui-selected': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.06)',
                  color: isDark ? '#FFFFFF' : '#171717',
                  borderColor: isDark ? '#404040' : '#A3A3A3',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.14)'
                      : 'rgba(0,0,0,0.08)',
                  },
                },
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                borderRadius: 6,
                fontSize: '0.8rem',
                backgroundColor: isDark ? '#262626' : '#171717',
                color: '#E5E5E5',
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: { borderColor: isDark ? '#262626' : '#E5E5E5' },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                margin: '1px 6px',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
                '&.Mui-selected': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(0,0,0,0.07)',
                  },
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 12,
                backgroundColor: isDark ? '#141414' : '#FFFFFF',
                border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
              },
            },
          },
          MuiAlert: {
            styleOverrides: { root: { borderRadius: 8 } },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                '&.Mui-checked': {
                  color: isDark ? '#FFFFFF' : '#171717',
                  '& + .MuiSwitch-track': {
                    backgroundColor: isDark ? '#FFFFFF' : '#171717',
                    opacity: 0.5,
                  },
                },
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              regular: {
                '@media (max-width: 600px)': {
                  minHeight: 48,
                  paddingLeft: 8,
                  paddingRight: 8,
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
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
