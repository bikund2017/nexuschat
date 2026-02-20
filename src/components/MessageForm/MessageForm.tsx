import {
  KeyboardEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import useTheme from '@mui/material/styles/useTheme'

import { messageCharacterSizeLimit } from 'config/messaging'
import { SettingsContext } from 'contexts/SettingsContext'
import { Form } from 'components/Elements'

interface MessageFormProps {
  onMessageSubmit: (message: string) => void
  onMessageChange: (message: string) => void
  isMessageSending: boolean
}

export const MessageForm = ({
  onMessageSubmit,
  onMessageChange,
  isMessageSending,
}: MessageFormProps) => {
  const settingsContext = useContext(SettingsContext)
  const { showActiveTypingStatus } = settingsContext.getUserSettings()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [textMessage, setTextMessage] = useState('')

  useEffect(() => {
    const { current: textField } = textFieldRef
    if (!textField) return

    textField.focus()
  }, [textFieldRef])

  const canMessageBeSent = () => {
    return (
      textMessage.trim().length > 0 &&
      textMessage.length < messageCharacterSizeLimit &&
      !isMessageSending
    )
  }

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setTextMessage(value)
    onMessageChange(value)
  }

  const submitMessage = () => {
    onMessageSubmit(textMessage)
    setTextMessage('')
  }

  const handleMessageKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, shiftKey } = event

    if (key === 'Enter' && shiftKey === false) {
      event.preventDefault()

      if (!canMessageBeSent()) return

      submitMessage()
    }
  }

  const handleMessageSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitMessage()
  }

  return (
    <Form
      onSubmit={handleMessageSubmit}
      sx={{
        ...(showActiveTypingStatus && {
          pt: 2,
          px: 2,
        }),
        ...(!showActiveTypingStatus && {
          p: 2,
        }),
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-end">
        <FormControl fullWidth>
          <TextField
            variant="outlined"
            value={textMessage}
            onChange={handleMessageChange}
            onKeyPress={handleMessageKeyPress}
            size="medium"
            placeholder="Type a message..."
            inputRef={textFieldRef}
            multiline
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
                '&.Mui-focused': {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.01)',
                  boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)',
                },
              },
            }}
          />
        </FormControl>
        <Box>
          <Fab
            sx={{
              flexShrink: 0,
              width: 48,
              height: 48,
              background: canMessageBeSent()
                ? 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)'
                : undefined,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: canMessageBeSent() ? 'scale(1.05)' : 'none',
                background: canMessageBeSent()
                  ? 'linear-gradient(135deg, #334155 0%, #64748B 100%)'
                  : undefined,
              },
              '&:disabled': {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            }}
            aria-label="Send"
            type="submit"
            disabled={!canMessageBeSent()}
            color="primary"
          >
            <ArrowUpward
              sx={{
                transition: 'transform 0.2s ease',
                ...(canMessageBeSent() && {
                  color: '#FFFFFF',
                }),
              }}
            />
          </Fab>
        </Box>
      </Stack>
    </Form>
  )
}
