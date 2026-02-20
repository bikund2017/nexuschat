import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Paper from '@mui/material/Paper'
import useTheme from '@mui/material/styles/useTheme'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import FileReaderInput, { Result } from 'react-file-reader-input'

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import NetworkCheckOutlinedIcon from '@mui/icons-material/NetworkCheckOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import { ConfirmDialog } from 'components/ConfirmDialog'
import { EnhancedConnectivityControl } from 'components/EnhancedConnectivityControl'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { SoundSelector } from 'components/SoundSelector/SoundSelector'
import { isEnhancedConnectivityAvailable } from 'config/enhancedConnectivity'
import { SettingsContext } from 'contexts/SettingsContext'
import { ShellContext } from 'contexts/ShellContext'
import { StorageContext } from 'contexts/StorageContext'
import { notification } from 'services/Notification'
import { settings } from 'services/Settings'

import { isErrorWithMessage } from '../../lib/type-guards'

interface SettingsProps {
  userId: string
}

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode
  title: string
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 2,
          background: isDark
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(100, 116, 139, 0.1))'
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(100, 116, 139, 0.05))',
          color: isDark ? '#38BDF8' : '#0284C7',
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.1rem' }}
      >
        {title}
      </Typography>
    </Box>
  )
}

const SettingsCard = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 3,
        background: isDark
          ? 'rgba(30, 41, 59, 0.5)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(100, 116, 139, 0.12)' : 'rgba(100, 116, 139, 0.08)'}`,
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </Paper>
  )
}

export const Settings = ({ userId }: SettingsProps) => {
  const theme = useTheme()

  const { setTitle, showAlert } = useContext(ShellContext)
  const { updateUserSettings, getUserSettings } = useContext(SettingsContext)
  const { getPersistedStorage } = useContext(StorageContext)
  const [
    isDeleteSettingsConfirmDiaglogOpen,
    setIsDeleteSettingsConfirmDiaglogOpen,
  ] = useState(false)
  const [, setIsNotificationPermissionDetermined] = useState(false)
  const {
    playSoundOnNewMessage,
    showNotificationOnNewMessage,
    showActiveTypingStatus,
    isEnhancedConnectivityEnabled,
  } = getUserSettings()

  const persistedStorage = getPersistedStorage()

  useEffect(() => {
    ; (async () => {
      await notification.requestPermission()
      setIsNotificationPermissionDetermined(true)
    })()
  }, [])

  useEffect(() => {
    setTitle('Settings')
  }, [setTitle])

  const handlePlaySoundOnNewMessageChange = (
    _event: ChangeEvent,
    newPlaySoundOnNewMessage: boolean
  ) => {
    updateUserSettings({ playSoundOnNewMessage: newPlaySoundOnNewMessage })
  }

  const handleShowNotificationOnNewMessageChange = (
    _event: ChangeEvent,
    newShowNotificationOnNewMessage: boolean
  ) => {
    updateUserSettings({
      showNotificationOnNewMessage: newShowNotificationOnNewMessage,
    })
  }

  const handleShowActiveTypingStatusChange = (
    _event: ChangeEvent,
    newShowActiveTypingStatus: boolean
  ) => {
    updateUserSettings({ showActiveTypingStatus: newShowActiveTypingStatus })
  }

  const handleIsEnhancedConnectivityEnabledChange = (
    _event: ChangeEvent,
    newIsEnhancedConnectivityEnabled: boolean
  ) => {
    if (isEnhancedConnectivityAvailable) {
      updateUserSettings({
        isEnhancedConnectivityEnabled: newIsEnhancedConnectivityEnabled,
      })
    }
  }

  const handleDeleteSettingsClick = () => {
    setIsDeleteSettingsConfirmDiaglogOpen(true)
  }

  const handleDeleteSettingsCancel = () => {
    setIsDeleteSettingsConfirmDiaglogOpen(false)
  }

  const handleDeleteSettingsConfirm = async () => {
    await persistedStorage.clear()
    window.location.reload()
  }

  const handleExportSettingsClick = async () => {
    try {
      await settings.exportSettings(getUserSettings())
    } catch (e) {
      if (isErrorWithMessage(e)) {
        showAlert(e.message, { severity: 'error' })
      }
    }
  }

  const handleImportSettingsClick = async ([[, file]]: Result[]) => {
    try {
      const userSettings = await settings.importSettings(file)
      updateUserSettings(userSettings)
      showAlert('Profile successfully imported', { severity: 'success' })
    } catch (e) {
      if (isErrorWithMessage(e)) {
        showAlert(e.message, { severity: 'error' })
      }
    }
  }

  const areNotificationsAvailable = notification.permission === 'granted'

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mx: 'auto',
        maxWidth: theme.breakpoints.values.md,
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Chat Settings */}
      <SectionHeader
        icon={<NotificationsOutlinedIcon fontSize="small" />}
        title="Chat"
      />
      <SettingsCard>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          When a message is received in the background:
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={playSoundOnNewMessage}
                onChange={handlePlaySoundOnNewMessageChange}
                color="secondary"
              />
            }
            label="Play a sound"
          />
          <FormControlLabel
            control={
              <Switch
                checked={
                  areNotificationsAvailable && showNotificationOnNewMessage
                }
                onChange={handleShowNotificationOnNewMessageChange}
                disabled={!areNotificationsAvailable}
                color="secondary"
              />
            }
            label="Show a notification"
          />
        </FormGroup>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Notification sound:
          </Typography>
          <SoundSelector disabled={!playSoundOnNewMessage} />
        </Box>
      </SettingsCard>

      <SettingsCard>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showActiveTypingStatus}
                onChange={handleShowActiveTypingStatusChange}
                color="secondary"
              />
            }
            label="Show active typing indicators"
          />
        </FormGroup>
        <Typography variant="caption" color="text.secondary">
          Disabling this will also hide your typing status from others.
        </Typography>
      </SettingsCard>

      {/* Networking */}
      {isEnhancedConnectivityAvailable && (
        <>
          <Divider sx={{ my: 3 }} />
          <SectionHeader
            icon={<NetworkCheckOutlinedIcon fontSize="small" />}
            title="Networking"
          />
          <SettingsCard>
            <EnhancedConnectivityControl
              isEnabled={isEnhancedConnectivityEnabled}
              onChange={handleIsEnhancedConnectivityEnabledChange}
              variant="subtitle2"
            />
          </SettingsCard>
        </>
      )}

      {/* Data Management */}
      <Divider sx={{ my: 3 }} />
      <SectionHeader
        icon={<StorageOutlinedIcon fontSize="small" />}
        title="Data Management"
      />

      <SettingsCard>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <FileUploadOutlinedIcon sx={{ color: 'secondary.main', mt: 0.3 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Export Profile
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Download your profile data for backup or transfer.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleExportSettingsClick}
          sx={{ borderRadius: 2 }}
        >
          Export profile data
        </Button>
      </SettingsCard>

      <SettingsCard>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <FileDownloadOutlinedIcon sx={{ color: 'warning.main', mt: 0.3 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Import Profile
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Restore a previously exported profile.
            </Typography>
          </Box>
        </Box>
        <FileReaderInput
          {...{
            as: 'text',
            onChange: (_e, results) => {
              handleImportSettingsClick(results)
            },
          }}
        >
          <Button
            color="warning"
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Import profile data
          </Button>
        </FileReaderInput>
      </SettingsCard>

      <SettingsCard>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <DeleteOutlineIcon sx={{ color: 'error.main', mt: 0.3 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Delete All Data
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This will reset your username from{' '}
              <strong>
                <PeerNameDisplay
                  sx={{ fontWeight: 600 }}
                >
                  {userId}
                </PeerNameDisplay>
              </strong>
              {' '}to a random name and clear all preferences.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDeleteSettingsClick}
          sx={{ borderRadius: 2 }}
        >
          Delete all data and restart
        </Button>
      </SettingsCard>

      <ConfirmDialog
        isOpen={isDeleteSettingsConfirmDiaglogOpen}
        onCancel={handleDeleteSettingsCancel}
        onConfirm={handleDeleteSettingsConfirm}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 2, mb: 4, opacity: 0.5, textAlign: 'center' }}
      >
        NexusChat stores preferences locally. No message content is ever persisted.
      </Typography>
    </Box>
  )
}
