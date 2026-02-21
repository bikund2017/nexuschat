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
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        textAlign: 'center',
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
        border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
        cursor: 'default',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 1.5,
          borderRadius: 2,
          mb: 1.5,
          background: isDark
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.04)',
          color: isDark ? '#D4D4D4' : '#404040',
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
          px: { xs: 1.5, sm: 2 },
          textAlign: 'center',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 3, md: 7 },
            px: { xs: 1, md: 2 },
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              mb: 3,
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
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: isDark ? '#FFFFFF' : '#171717',
              fontSize: { xs: '2.2rem', md: '3rem' },
              letterSpacing: '-0.03em',
            }}
          >
            NexusChat
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 480,
              mx: 'auto',
              mb: 1.5,
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
            mb: { xs: 3, md: 6 },
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
            border: `1px solid ${isDark ? '#262626' : '#E5E5E5'}`,
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.45s ease-out',
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
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
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.3s',
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
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.85rem',
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
                  borderRadius: 2,
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
            sx={{
              mb: 3,
              opacity: 0.7,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            Why NexusChat?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr 1fr',
                sm: 'repeat(auto-fit, minmax(200px, 1fr))',
              },
              gap: { xs: 1.5, sm: 2 },
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

        {/* Embed Control */}
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
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              fontSize: '0.8rem',
            }}
          >
            Embed
          </Button>
        </Box>
      </Main>
    </Box>
  )
}
