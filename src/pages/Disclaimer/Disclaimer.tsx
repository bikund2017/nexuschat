import { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme'

import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

import { ShellContext } from 'contexts/ShellContext'

const DisclaimerSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Box
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 2,
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
        border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 2,
            background: isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.04)',
            color: isDark ? '#D4D4D4' : '#404040',
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.8, pl: 0.5 }}
      >
        {children}
      </Typography>
    </Box>
  )
}

export const Disclaimer = () => {
  const { setTitle } = useContext(ShellContext)
  const theme = useTheme()

  useEffect(() => {
    setTitle('Disclaimer')
  }, [setTitle])

  return (
    <Box
      className="Disclaimer"
      sx={{
        p: { xs: 2, md: 3 },
        mx: 'auto',
        maxWidth: theme.breakpoints.values.md,
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, pt: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#171717',
          }}
        >
          Disclaimer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please read these terms carefully before using NexusChat.
        </Typography>
      </Box>

      <DisclaimerSection
        icon={<GavelOutlinedIcon fontSize="small" />}
        title="General"
      >
        The information contained on this Service is for general information
        purposes only. The Project assumes no responsibility for errors or
        omissions. In no event shall the Project be liable for any special,
        direct, indirect, consequential, or incidental damages arising out of or
        in connection with the use of the Service.
      </DisclaimerSection>

      <DisclaimerSection
        icon={<ShieldOutlinedIcon fontSize="small" />}
        title="Privacy"
      >
        NexusChat is a peer-to-peer application. No messages, files, or media
        are stored on any server. All communication is encrypted end-to-end and
        exists only in volatile memory during your session. Once you close the
        page, all data is permanently erased.
      </DisclaimerSection>

      <DisclaimerSection
        icon={<WarningAmberOutlinedIcon fontSize="small" />}
        title="No Warranty"
      >
        All information in the Service is provided "as is", with no guarantee of
        completeness, accuracy, or timeliness, and without warranty of any kind,
        express or implied, including but not limited to warranties of
        performance, merchantability, and fitness for a particular purpose.
      </DisclaimerSection>

      <DisclaimerSection
        icon={<PersonOutlineIcon fontSize="small" />}
        title="User Responsibility"
      >
        Messages sent by users are their sole responsibility. The Project is not
        liable for any content shared through the Service. Users take full
        responsibility for any content they create or share during their
        sessions.
      </DisclaimerSection>
    </Box>
  )
}
