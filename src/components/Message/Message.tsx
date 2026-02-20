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
  isMessageReceived,
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
    trimmedMessage.match(/https:\/\/www.youtube.com\/watch\?v=(\S{8,})$/) ||
    trimmedMessage.match(/https:\/\/youtu.be\/(\S{8,})$/)

  return matchArray?.pop()
}

const isYouTubeLink = (message: IMessage) => {
  return typeof getYouTubeVideoId(message.text) === 'string'
}



export const Message = ({ message, showAuthor, userId }: MessageProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isSent = message.authorId === userId


  let backgroundColor: string
  let bubbleStyles: Record<string, any> = {}

  if (isSent) {
    if (isDark) {
      backgroundColor = isMessageReceived(message)
        ? 'transparent'
        : 'transparent'
      bubbleStyles = {
        background: isMessageReceived(message)
          ? 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
          : 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
      }
    } else {
      backgroundColor = isMessageReceived(message)
        ? 'primary.main'
        : 'primary.light'
    }
  } else {
    if (isDark) {
      backgroundColor = 'transparent'
      bubbleStyles = {
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }
    } else {
      backgroundColor = 'grey.100'
    }
  }



  return (
    <Box
      className="Message nexus-fade-in"
      sx={{ position: 'relative' }}
    >
      {showAuthor && (
        <Typography
          variant="caption"
          display="block"
          sx={{
            textAlign: isSent ? 'right' : 'left',
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
            color: isSent
              ? 'primary.contrastText'
              : isDark
                ? '#E2E8F0'
                : 'text.primary',
            backgroundColor,
            ...bubbleStyles,
            margin: 0.5,
            padding: '10px 16px',
            borderRadius: isSent
              ? '18px 18px 4px 18px'
              : '18px 18px 18px 4px',
            float: isSent ? 'right' : 'left',
            transition: 'all 0.3s ease',
            wordBreak: 'break-word',
            boxShadow: isDark
              ? isSent
                ? '0 2px 12px rgba(100, 116, 139, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 1px 4px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              boxShadow: isDark
                ? isSent
                  ? '0 4px 20px rgba(100, 116, 139, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.25)'
                : '0 2px 8px rgba(0, 0, 0, 0.12)',
            },
          }}
          maxWidth="85%"
        >
          {isInlineMedia(message) ? (
            <InlineMedia magnetURI={message.magnetURI} />
          ) : isYouTubeLink(message) ? (
            <YouTube videoId={getYouTubeVideoId(message.text)} />
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
        </Box>
      </Tooltip>

    </Box>
  )
}
