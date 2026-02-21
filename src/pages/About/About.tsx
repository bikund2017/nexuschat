import { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { ShellContext } from 'contexts/ShellContext'
import LogoIcon from 'img/icon.svg?react'
import {
  messageTranscriptSizeLimit,
  messageCharacterSizeLimit,
} from 'config/messaging'

const messageTranscriptSizeLimitFormatted = Intl.NumberFormat().format(
  messageTranscriptSizeLimit
)

const messageCharacterSizeLimitFormatted = Intl.NumberFormat().format(
  messageCharacterSizeLimit
)

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2.5,
        borderRadius: 2,
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
        border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 2,
          flexShrink: 0,
          background: isDark
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.04)',
          color: isDark ? '#D4D4D4' : '#404040',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

const InfoCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 2,
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
        border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export const About = () => {
  const { setTitle } = useContext(ShellContext)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  useEffect(() => {
    setTitle('About')
  }, [setTitle])

  return (
    <Box
      className="About"
      sx={{
        p: { xs: 2, md: 3 },
        mx: 'auto',
        maxWidth: theme.breakpoints.values.md,
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, pt: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            mb: 1.5,
            p: 2,
            borderRadius: 3,
            background: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(0, 0, 0, 0.03)',
          }}
        >
          <LogoIcon style={{ width: 48, height: 48 }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: isDark ? '#FFFFFF' : '#171717',
          }}
        >
          About NexusChat
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 500, mx: 'auto' }}
        >
          A secure, peer-to-peer communication platform built with privacy as
          the foundation.
        </Typography>
      </Box>

      {/* Features Grid */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: 'block',
          mb: 2,
          fontWeight: 600,
          letterSpacing: '0.1em',
        }}
      >
        Key Features
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
        <FeatureItem
          icon={<SecurityOutlinedIcon fontSize="small" />}
          title="End-to-End Encrypted"
          description="Messages are encrypted before leaving your device. Your private key never leaves your browser."
        />
        <FeatureItem
          icon={<CloudOffOutlinedIcon fontSize="small" />}
          title="Peer-to-Peer Architecture"
          description="No central server stores your data. Communication happens directly between peers via WebRTC."
        />
        <FeatureItem
          icon={<ChatBubbleOutlineIcon fontSize="small" />}
          title="Real-Time Messaging"
          description="Instant message delivery with typing indicators and markdown support with syntax highlighting."
        />
        <FeatureItem
          icon={<VideocamOutlinedIcon fontSize="small" />}
          title="Video & Audio Calls"
          description="Built-in media sharing with screen sharing and file transfer capabilities."
        />
      </Box>

      {/* Info Cards */}
      <InfoCard title="Chat Rooms">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          <strong>Public rooms</strong> can be joined by anyone with the URL. By
          default, rooms get random, unguessable names.{' '}
          <strong>Private rooms</strong> require all participants to enter the
          same password. No error is shown for password mismatches — peers
          simply cannot connect.
        </Typography>
      </InfoCard>

      <InfoCard title="Peer Verification">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          NexusChat uses public-key cryptography to verify peers. All keys are
          generated locally. Share your public key freely — it's not sensitive.
          Your private key never leaves your device.
        </Typography>
      </InfoCard>

      <InfoCard title="Conversations">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          Transcripts are erased from memory when you close the page. In public
          rooms, new peers receive the existing transcript on join. History is
          limited to {messageTranscriptSizeLimitFormatted} messages. Messages
          support Markdown with syntax highlighting. Max message size:{' '}
          {messageCharacterSizeLimitFormatted} characters.
        </Typography>
      </InfoCard>
    </Box>
  )
}
