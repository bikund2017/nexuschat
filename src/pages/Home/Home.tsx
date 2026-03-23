import { useContext } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme'
import { Cached } from '@mui/icons-material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'

import LogoIcon from 'img/icon.svg?react'
import { Form, Main } from 'components/Elements'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { SettingsContext } from 'contexts/SettingsContext'

import { RoomNameType } from 'lib/RoomNameGenerator'

import { useHome } from './useHome'
import { EmbedCodeDialog } from './EmbedCodeDialog'
import { CommunityRoomSelector } from './CommunityRoomSelector'

export interface HomeProps {
  userId: string
}

const FeatureCard = ({
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
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        textAlign: 'left',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.25,
          borderRadius: 1.5,
          background: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
          color: isDark ? '#D4D4D4' : '#404040',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.4 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export const Home = ({ userId }: HomeProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const {
    roomName,
    roomNameType,
    showEmbedCode,
    handleRoomNameChange,
    handleRoomNameTypeChange,
    regenerateRoomName,
    handleFormSubmit,
    handleJoinPublicRoomClick,
    handleJoinPrivateRoomClick,
    handleEmbedCodeWindowClose,
    handleGetEmbedCodeClick,
    isRoomNameValid,
  } = useHome()

  const { getUserSettings } = useContext(SettingsContext)
  getUserSettings()

  return (
    <Box className="Home">
      <EmbedCodeDialog
        showEmbedCode={showEmbedCode}
        handleEmbedCodeWindowClose={handleEmbedCodeWindowClose}
        roomName={roomName}
      />
      <Main
        sx={{
          maxWidth: theme.breakpoints.values.md,
          mt: 0,
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
          textAlign: 'center',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 3, md: 5 },
            animation: 'fadeIn 0.5s ease-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              mb: 2,
              p: 1.5,
              borderRadius: 3,
              background: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)',
            }}
          >
            <LogoIcon style={{ width: 42, height: 42 }} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              color: isDark ? '#FFFFFF' : '#171717',
              fontSize: { xs: '2rem', md: '2.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            NexusChat
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: 500,
              mx: 'auto',
              mb: 1,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            Secure peer-to-peer communication.
            <br />
            No servers. No tracking. No compromise.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, opacity: 0.8 }}
          >
            Welcome,{' '}
            <strong>
              <PeerNameDisplay>{userId}</PeerNameDisplay>
            </strong>
          </Typography>
        </Box>

        {/* Room Creation Card */}
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            mb: { xs: 3, md: 4 },
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
            border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.45s ease-out',
            textAlign: 'left',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, textAlign: 'center' }}>
            Create or Join a Room
          </Typography>

          <ToggleButtonGroup
            value={roomNameType}
            exclusive
            onChange={handleRoomNameTypeChange}
            fullWidth
            size="small"
            sx={{ mb: 3 }}
          >
            <ToggleButton value={RoomNameType.UUID} sx={{ py: 1, textTransform: 'none', fontWeight: 600 }}>
              <LockOutlinedIcon sx={{ mr: 0.75, fontSize: '1.2rem' }} />
              Random ID
            </ToggleButton>
            <ToggleButton value={RoomNameType.PASSPHRASE} sx={{ py: 1, textTransform: 'none', fontWeight: 600 }}>
              <GroupsOutlinedIcon sx={{ mr: 0.75, fontSize: '1.2rem' }} />
              Passphrase
            </ToggleButton>
          </ToggleButtonGroup>

          <Form onSubmit={handleFormSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Room name"
                  variant="outlined"
                  value={roomName}
                  onChange={handleRoomNameChange}
                  fullWidth
                  size="small"
                  placeholder="Enter a room name..."
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
                <IconButton
                  onClick={regenerateRoomName}
                  aria-label="Generate random room name"
                  size="small"
                  sx={{
                    color: 'secondary.main',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    p: 1,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.3s',
                      bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Cached />
                </IconButton>
              </Box>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!isRoomNameValid}
                onClick={handleJoinPublicRoomClick}
                sx={{
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                }}
              >
                Join Public
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                disabled={!isRoomNameValid}
                onClick={handleJoinPrivateRoomClick}
                sx={{
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  borderWidth: '2px',
                  '&:hover': { borderWidth: '2px' }
                }}
              >
                Join Private
              </Button>
            </Box>
          </Form>
        </Box>

        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          {/* Community Rooms */}
          <Box sx={{ mb: 4, animation: 'fadeIn 0.8s ease-out' }}>
            <CommunityRoomSelector />
          </Box>

          {/* Feature Cards */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="overline"
              fontWeight={700}
              sx={{
                display: 'block',
                mb: 2,
                opacity: 0.7,
                letterSpacing: '0.05em',
                textAlign: 'center'
              }}
            >
              Why NexusChat?
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                },
                gap: 2,
              }}
            >
              <FeatureCard
                icon={<SecurityOutlinedIcon />}
                title="End-to-End Encrypted"
                description="Messages are encrypted before leaving your device"
              />
              <FeatureCard
                icon={<CloudOffOutlinedIcon />}
                title="No Servers"
                description="Direct peer-to-peer — nothing stored anywhere"
              />
              <FeatureCard
                icon={<ChatBubbleOutlineIcon />}
                title="Real-Time Chat"
                description="Instant messaging with typing indicators"
              />
              <FeatureCard
                icon={<DevicesOutlinedIcon />}
                title="Cross-Platform"
                description="Works on any modern browser, any device"
              />
            </Box>
          </Box>

          {/* Embed Control */}
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<CodeOutlinedIcon />}
              onClick={handleGetEmbedCodeClick}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                fontSize: '0.85rem',
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              Embed Room
            </Button>
          </Box>
        </Box>
      </Main>
    </Box>
  )
}
