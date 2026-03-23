import { HTMLAttributes } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import YouTube from 'react-youtube'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Link, { LinkProps } from '@mui/material/Link'
import styled from '@mui/material/styles/styled'
import useTheme from '@mui/material/styles/useTheme'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Markdown, { ExtraProps } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  InlineMedia as I_InlineMedia,
  Message as IMessage,
  DeliveryStatus,
  isInlineMedia,
} from 'models/chat'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { CopyableBlock } from 'components/CopyableBlock/CopyableBlock'

import { InlineMedia } from './InlineMedia'

const StyledMarkdown = styled(Markdown)({})

export interface MessageProps {
  message: IMessage | I_InlineMedia
  showAuthor: boolean
  userId: string
}

const typographyFactory =
  (overrides: TypographyProps) => (args: HTMLAttributes<HTMLElement>) => {
    return <Typography {...args} {...overrides} />
  }

const linkFactory =
  (overrides: LinkProps) => (args: HTMLAttributes<HTMLElement>) => {
    return <Link {...args} {...overrides} />
  }

const componentMap = {
  h1: typographyFactory({ variant: 'h1' }),
  h2: typographyFactory({ variant: 'h2' }),
  h3: typographyFactory({ variant: 'h3' }),
  h4: typographyFactory({ variant: 'h4' }),
  h5: typographyFactory({ variant: 'h5' }),
  h6: typographyFactory({ variant: 'h6' }),
  p: typographyFactory({ variant: 'body1' }),
  a: linkFactory({
    variant: 'body1',
    underline: 'always',
    color: 'primary.contrastText',
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  // https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
  code({
    node,
    className,
    children,
    style,
    ...props
  }: HTMLAttributes<HTMLElement> & ExtraProps) {
    const match = /language-(\w+)/.exec(className || '')

    return match ? (
      <CopyableBlock>
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          language={match[1]}
          style={materialDark}
          PreTag="div"
          {...props}
        />
      </CopyableBlock>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

const spaceNeededForSideDateTooltip = 850

const getYouTubeVideoId = (videoUrl: string) => {
  const trimmedMessage = videoUrl.trim()

  const matchArray =
    trimmedMessage.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&\s]{11})/) ||
    trimmedMessage.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\s]{11})/)

  return matchArray ? matchArray[1] : undefined
}

const isYouTubeLink = (message: IMessage) => {
  return typeof getYouTubeVideoId(message.text) === 'string'
}

export const Message = ({ message, showAuthor, userId }: MessageProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isSent = message.authorId === userId

  let bubbleStyles: Record<string, any> = {}

  if (isSent) {
    bubbleStyles = isDark
      ? { backgroundColor: '#2A2A2A', color: '#E5E5E5' }
      : { backgroundColor: '#171717', color: '#FFFFFF' }
  } else {
    bubbleStyles = isDark
      ? {
          backgroundColor: '#1A1A1A',
          color: '#E5E5E5',
        }
      : {
          backgroundColor: '#F5F5F5',
          color: '#171717',
        }
  }

  return (
    <Box
      className="Message nexus-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSent ? 'flex-end' : 'flex-start',
        mt: showAuthor ? 1.5 : 0.5,
      }}
    >
      {showAuthor && (
        <Typography
          variant="caption"
          display="block"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.75rem',
            mb: 0.25,
          }}
        >
          <PeerNameDisplay>{message.authorId}</PeerNameDisplay>
        </Typography>
      )}
      <Tooltip
        placement={
          window.innerWidth >= spaceNeededForSideDateTooltip ? 'left' : 'top'
        }
        title={String(
          Intl.DateTimeFormat(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(message.timeSent)
        )}
      >
        <Box
          sx={{
            ...bubbleStyles,
            display: 'inline-block',
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            wordBreak: 'break-word',
            maxWidth: { xs: '85%', sm: '75%' },
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {isInlineMedia(message) ? (
            <InlineMedia magnetURI={message.magnetURI} />
          ) : isYouTubeLink(message) ? (
            <YouTube
              videoId={getYouTubeVideoId(message.text)}
              opts={{ width: '100%', playerVars: { origin: window.location.origin } }}
              style={{ maxWidth: '100%', borderRadius: '8px', overflow: 'hidden' }}
            />
          ) : (
            <StyledMarkdown
              components={componentMap}
              remarkPlugins={[remarkGfm]}
              sx={{
                '& pre': {
                  overflow: 'auto',
                },
                '& ol': {
                  pl: 2,
                  listStyleType: 'decimal',
                },
                '& ul': {
                  pl: 2,
                  listStyleType: 'disc',
                },
              }}
            >
              {message.text}
            </StyledMarkdown>
          )}
          {isSent && !isInlineMedia(message) && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                ml: 0.5,
                fontSize: '0.65rem',
                lineHeight: 1,
                opacity: 0.6,
                userSelect: 'none',
                verticalAlign: 'bottom',
              }}
              aria-label={
                message.deliveryStatus === DeliveryStatus.DELIVERED
                  ? 'Delivered'
                  : message.deliveryStatus === DeliveryStatus.SENT
                    ? 'Sent'
                    : 'Sending'
              }
            >
              {message.deliveryStatus === DeliveryStatus.DELIVERED ? (
                <span style={{ letterSpacing: '-3px', fontWeight: 700 }}>
                  ✓✓
                </span>
              ) : message.deliveryStatus === DeliveryStatus.SENT ? (
                <span style={{ fontWeight: 700 }}>✓</span>
              ) : (
                <span style={{ fontWeight: 400 }}>○</span>
              )}
            </Box>
          )}
        </Box>
      </Tooltip>
    </Box>
  )
}
