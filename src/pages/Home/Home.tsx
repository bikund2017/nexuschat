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
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'

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
        flex: '1 1 200px',
        p: 3,
        borderRadius: 3,
        textAlign: 'center',
        background: isDark
          ? 'rgba(30, 41, 59, 0.5)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(100, 116, 139, 0.12)' : 'rgba(100, 116, 139, 0.08)'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark
            ? '0 12px 40px rgba(56, 189, 248, 0.12)'
            : '0 12px 40px rgba(100, 116, 139, 0.12)',
          borderColor: isDark
            ? 'rgba(56, 189, 248, 0.25)'
            : 'rgba(100, 116, 139, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 1.5,
          borderRadius: 2,
          mb: 1.5,
          background: isDark
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(100, 116, 139, 0.1))'
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(100, 116, 139, 0.05))',
          color: isDark ? '#38BDF8' : '#0284C7',
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {description}
      </Typography>
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
  const { customUsername } = getUserSettings()

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
          px: 2,
          textAlign: 'center',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            px: 2,
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #64748B 20%, #38BDF8 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.03em',
            }}
          >
            NexusChat
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 500,
              mx: 'auto',
              mb: 1,
              fontWeight: 400,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.7,
            }}
          >
            Secure peer-to-peer communication.
            <br />
            No servers. No tracking. No compromise.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, opacity: 0.6 }}
          >
            Welcome,{' '}
            <strong>
              <PeerNameDisplay>{customUsername || userId}</PeerNameDisplay>
            </strong>
          </Typography>
        </Box>

        {/* Room Creation Card */}
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            mb: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: isDark
              ? 'rgba(30, 41, 59, 0.5)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(100, 116, 139, 0.12)' : 'rgba(100, 116, 139, 0.08)'}`,
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(100, 116, 139, 0.08)',
            animation: 'slideUp 0.5s ease-out',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 3 }}
          >
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
            <ToggleButton value={RoomNameType.UUID} sx={{ py: 1 }}>
              <LockOutlinedIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Random ID
            </ToggleButton>
            <ToggleButton value={RoomNameType.PASSPHRASE} sx={{ py: 1 }}>
              <GroupsOutlinedIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Passphrase
            </ToggleButton>
          </ToggleButtonGroup>

          <Form onSubmit={handleFormSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Room name"
                  variant="outlined"
                  value={roomName}
                  onChange={handleRoomNameChange}
                  fullWidth
                  size="small"
                  placeholder="Enter a room name..."
                />
                <IconButton
                  onClick={regenerateRoomName}
                  aria-label="Generate random room name"
                  size="small"
                  sx={{
                    color: 'secondary.main',
                    '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s' },
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
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #475569, #64748B)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #334155, #475569)',
                    boxShadow: '0 6px 24px rgba(56, 189, 248, 0.2)',
                  },
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
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Join Private
              </Button>
            </Box>
          </Form>
        </Box>

        {/* Feature Cards */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 3, opacity: 0.7, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            Why NexusChat?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
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

        {/* Community Rooms */}
        <Box sx={{ mb: 4, animation: 'fadeIn 0.8s ease-out' }}>
          <CommunityRoomSelector />
        </Box>

        {/* Embed & Utility Controls */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<CodeOutlinedIcon />}
            onClick={handleGetEmbedCodeClick}
            sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}
          >
            Embed
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<VisibilityOffOutlinedIcon />}
            sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}
          >
            Stealth Mode
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<BoltOutlinedIcon />}
            sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}
          >
            Quick Connect
          </Button>
        </Box>
      </Main>
    </Box>
  )
}
