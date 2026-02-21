import { useRef, useEffect, useState, useContext } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import useTheme from '@mui/material/styles/useTheme'

import { Message as IMessage, InlineMedia } from 'models/chat'
import { Message } from 'components/Message'
import { ShellContext } from 'contexts/ShellContext'

export interface ChatTranscriptProps extends BoxProps {
  messageLog: Array<IMessage | InlineMedia>
  userId: string
}

export const ChatTranscript = ({
  messageLog,
  userId,
  sx,
}: ChatTranscriptProps) => {
  const { showRoomControls } = useContext(ShellContext)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const boxRef = useRef<HTMLDivElement>(null)
  const [previousMessageLogLength, setPreviousMessageLogLength] = useState(0)

  useEffect(() => {
    const { current: boxEl } = boxRef
    if (!boxEl) return

    const { scrollHeight, clientHeight, scrollTop, children } = boxEl
    const scrollTopMax = scrollHeight - clientHeight

    if (children.length === 0) return

    const lastChild = children[children.length - 1]
    const lastChildHeight = lastChild.clientHeight
    const previousScrollTopMax = scrollTopMax - lastChildHeight

    // Accounts for rounding errors in layout calculations
    const marginBuffer = 1

    const wasPreviouslyScrolledToBottom =
      Math.ceil(scrollTop) >= Math.ceil(previousScrollTopMax) - marginBuffer
    const wasMessageLogPreviouslyEmpty = previousMessageLogLength === 0
    const shouldScrollToLatestMessage =
      wasPreviouslyScrolledToBottom || wasMessageLogPreviouslyEmpty

    if (
      shouldScrollToLatestMessage &&
      // scrollTo is not defined in the unit test environment
      'scrollTo' in boxEl
    ) {
      boxEl.scrollTo({ top: scrollTopMax })
    }
  }, [messageLog, previousMessageLogLength])

  useEffect(() => {
    setPreviousMessageLogLength(messageLog.length)
  }, [messageLog.length])

  return (
    <Box
      ref={boxRef}
      className="ChatTranscript"
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'auto',
          mx: { xs: 0.5, sm: 1.5 },
          mt: { xs: 0.5, sm: 1 },
          mb: 0,
          p: { xs: 1.5, sm: 2 },
          pt: showRoomControls
            ? { xs: theme.spacing(6), sm: theme.spacing(8) }
            : { xs: 1.5, sm: 2 },
          border: `1px solid ${isDark ? '#333333' : '#E5E5E5'}`,
          borderRadius: '8px',
          transition: `padding-top ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
          width: 'auto',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {messageLog.map((message, idx) => {
        const previousMessage = messageLog[idx - 1]
        const isFirstMessageInGroup =
          previousMessage?.authorId !== message.authorId

        return (
          <div key={message.id}>
            <Message
              message={message}
              userId={userId}
              showAuthor={isFirstMessageInGroup}
            />
          </div>
        )
      })}
    </Box>
  )
}
