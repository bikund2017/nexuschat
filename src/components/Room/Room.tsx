import Box from '@mui/material/Box'
import useTheme from '@mui/material/styles/useTheme'
import Zoom from '@mui/material/Zoom'
import { useWindowSize } from '@react-hook/window-size'
import { useContext } from 'react'
import { v4 as uuid } from 'uuid'

import { ChatTranscript } from 'components/ChatTranscript'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { WholePageLoading } from 'components/Loading'
import { MessageForm } from 'components/MessageForm'
import { trackerUrls } from 'config/trackerUrls'
import { RoomContext } from 'contexts/RoomContext'
import { SettingsContext } from 'contexts/SettingsContext'
import { ShellContext } from 'contexts/ShellContext'
import { useTurnConfig } from 'hooks/useTurnConfig'
import { time } from 'lib/Time'
import { encryption } from 'services/Encryption'

import { RoomAudioControls } from './RoomAudioControls'
import { RoomFileUploadControls } from './RoomFileUploadControls'
import { RoomScreenShareControls } from './RoomScreenShareControls'
import { RoomShowMessagesControls } from './RoomShowMessagesControls'
import { RoomVideoControls } from './RoomVideoControls'
import { RoomVideoDisplay } from './RoomVideoDisplay'
import { TypingStatusBar } from './TypingStatusBar'
import { useRoom } from './useRoom'
import { FileTransferProvider } from 'providers/FileTransferProvider'

export interface RoomProps {
  appId?: string
  getUuid?: typeof uuid
  password?: string
  roomId: string
  userId: string
  encryptionService?: typeof encryption
  timeService?: typeof time
  targetPeerId?: string
}

interface RoomInnerProps extends RoomProps {
  turnConfig: RTCConfiguration
}

const RoomCore = ({
  appId = `${encodeURI(window.location.origin)}_${process.env.VITE_NAME}`,
  getUuid = uuid,
  encryptionService = encryption,
  timeService = time,
  roomId,
  password,
  userId,
  targetPeerId,
  turnConfig,
}: RoomInnerProps) => {
  const theme = useTheme()
  const settingsContext = useContext(SettingsContext)
  const { showActiveTypingStatus, publicKey } =
    settingsContext.getUserSettings()

  const {
    isDirectMessageRoom,
    handleInlineMediaUpload,
    handleMessageChange,
    isMessageSending,
    messageLog,
    peerRoom,
    roomContextValue,
    sendMessage,
    showVideoDisplay,
  } = useRoom(
    {
      appId,
      relayUrls: trackerUrls,
      password,
      relayRedundancy: 4,
      turnConfig: turnConfig.iceServers,
      // NOTE: Avoid using STUN severs in the E2E tests in order to make them
      // run faster
      ...(import.meta.env.VITE_IS_E2E_TEST && {
        rtcConfig: {
          iceServers: [],
        },
      }),
    },
    {
      roomId,
      userId,
      getUuid,
      publicKey,
      encryptionService,
      timeService,
      targetPeerId,
    }
  )

  const { showRoomControls } = useContext(ShellContext)
  const [windowWidth, windowHeight] = useWindowSize()
  const landscape = windowWidth > windowHeight

  const handleMessageSubmit = async (message: string) => {
    await sendMessage(message)
  }

  const showMessages = roomContextValue.isShowingMessages

  // NOTE: If rtcConfig fails to load, the useRtcConfig hook provides a
  // fallback so the room will continue to work with default settings

  return (
    <RoomContext.Provider value={roomContextValue}>
      <Box
        className="Room"
        sx={{
          height: '100%',
          display: 'flex',
          flexGrow: '1',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            overflow: 'auto',
          }}
        >
          {!isDirectMessageRoom && (
            <Zoom in={showRoomControls}>
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'visible',
                  height: 0,
                  position: 'relative',
                  top: theme.spacing(1),
                  gap: { xs: 0, sm: 0 },
                }}
              >
                <RoomAudioControls peerRoom={peerRoom} />
                <RoomVideoControls peerRoom={peerRoom} />
                <RoomScreenShareControls peerRoom={peerRoom} />
                <RoomFileUploadControls
                  peerRoom={peerRoom}
                  onInlineMediaUpload={handleInlineMediaUpload}
                />
                <Zoom in={showVideoDisplay} mountOnEnter unmountOnExit>
                  <span>
                    <RoomShowMessagesControls />
                  </span>
                </Zoom>
              </Box>
            </Zoom>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: landscape ? 'row' : 'column',
              height: '100%',
              width: '100%',
              overflow: 'auto',
            }}
          >
            {showVideoDisplay && (
              <ErrorBoundary>
                <RoomVideoDisplay
                  userId={userId}
                  width="100%"
                  height={landscape || !showMessages ? '100%' : '60%'}
                />
              </ErrorBoundary>
            )}
            {showMessages && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: '1',
                  width: showVideoDisplay && landscape ? '400px' : '100%',
                  height: landscape ? '100%' : '40%',
                }}
              >
                <ChatTranscript
                  messageLog={messageLog}
                  userId={userId}
                  sx={{ ...(isDirectMessageRoom && { pt: 1 }) }}
                />
                <Box>
                  <MessageForm
                    onMessageSubmit={handleMessageSubmit}
                    isMessageSending={isMessageSending}
                    onMessageChange={handleMessageChange}
                  />
                  {showActiveTypingStatus ? (
                    <TypingStatusBar
                      isDirectMessageRoom={isDirectMessageRoom}
                    />
                  ) : null}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </RoomContext.Provider>
  )
}

export const Room = (props: RoomProps) => {
  const { isEnhancedConnectivityEnabled } =
    useContext(SettingsContext).getUserSettings()

  // Fetch rtcConfig from server
  const { turnConfig, isLoading: isConfigLoading } = useTurnConfig(
    isEnhancedConnectivityEnabled
  )

  if (isConfigLoading) {
    return <WholePageLoading />
  }

  // FileTransferProvider is placed HERE (after useTurnConfig resolves) so that
  // the WebTorrent / secure-file-transfer layer gets the same STUN/TURN ICE
  // servers as the trystero signaling layer. Without this, file downloads and
  // inline media would be stuck loading on the receiver side whenever peers
  // are behind NAT.
  return (
    <FileTransferProvider rtcConfig={turnConfig}>
      <RoomCore {...props} turnConfig={turnConfig} />
    </FileTransferProvider>
  )
}
