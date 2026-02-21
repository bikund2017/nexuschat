import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Videocam from '@mui/icons-material/Videocam'
import VideocamOff from '@mui/icons-material/VideocamOff'
import CameraswitchOutlined from '@mui/icons-material/CameraswitchOutlined'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'

import { PeerRoom } from 'lib/PeerRoom'

import { useRoomVideo } from './useRoomVideo'
import { MediaButton } from './MediaButton'

export interface RoomVideoControlsProps {
  peerRoom: PeerRoom
}

export function RoomVideoControls({ peerRoom }: RoomVideoControlsProps) {
  const {
    videoDevices,
    isCameraEnabled,
    setIsCameraEnabled,
    handleVideoDeviceSelect,
  } = useRoomVideo({ peerRoom })

  const [videoAnchorEl, setVideoAnchorEl] = useState<null | HTMLElement>(null)
  const isVideoDeviceSelectOpen = Boolean(videoAnchorEl)
  const [selectedVideoDeviceIdx, setSelectedVideoDeviceIdx] = useState(0)

  const handleEnableCameraClick = () => {
    setIsCameraEnabled(!isCameraEnabled)
  }

  const handleVideoDeviceListItemClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setVideoAnchorEl(event.currentTarget)
  }

  const handleVideoDeviceMenuItemClick = (
    _event: React.MouseEvent<HTMLElement>,
    idx: number
  ) => {
    setSelectedVideoDeviceIdx(idx)
    handleVideoDeviceSelect(videoDevices[idx])
    setVideoAnchorEl(null)
  }

  const handleVideoInputSelectMenuClose = () => {
    setVideoAnchorEl(null)
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 1,
      }}
    >
      <Tooltip title={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}>
        <MediaButton
          isActive={isCameraEnabled}
          aria-label="toggle camera"
          onClick={handleEnableCameraClick}
        >
          {isCameraEnabled ? <Videocam /> : <VideocamOff />}
        </MediaButton>
      </Tooltip>
      {videoDevices.length > 1 && isCameraEnabled && (
        <>
          <Tooltip title="Switch camera">
            <IconButton
              size="small"
              id="video-input-select-button"
              aria-haspopup="listbox"
              aria-controls="video-input-select-menu"
              aria-label="Switch camera"
              aria-expanded={isVideoDeviceSelectOpen ? 'true' : undefined}
              onClick={handleVideoDeviceListItemClick}
              sx={{ mt: 0.5 }}
            >
              <CameraswitchOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            id="video-input-select-menu"
            anchorEl={videoAnchorEl}
            open={isVideoDeviceSelectOpen}
            onClose={handleVideoInputSelectMenuClose}
            MenuListProps={{
              'aria-labelledby': 'video-input-select-button',
              role: 'listbox',
            }}
          >
            {videoDevices.map((videoDevice, idx) => (
              <MenuItem
                key={videoDevice.deviceId}
                selected={idx === selectedVideoDeviceIdx}
                onClick={event => handleVideoDeviceMenuItemClick(event, idx)}
              >
                <ListItemText primary={videoDevice.label} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  )
}
