import {
  KeyboardEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

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
          pt: { xs: 0.75, sm: 1 },
          px: { xs: 0.75, sm: 1.5 },
        }),
        ...(!showActiveTypingStatus && {
          p: { xs: 0.75, sm: 1.5 },
          pt: { xs: 0.75, sm: 1 },
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Message input */}
        <FormControl sx={{ flex: 1 }}>
          <TextField
            variant="outlined"
            value={textMessage}
            onChange={handleMessageChange}
            onKeyPress={handleMessageKeyPress}
            size="small"
            placeholder="Type a message..."
            inputRef={textFieldRef}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: 0.5,
              },
            }}
          />
        </FormControl>

        {/* Send button */}
        <Button
          variant="contained"
          type="submit"
          disabled={!canMessageBeSent()}
          size="large"
          sx={{
            flexShrink: 0,
            minWidth: 'unset',
            px: { xs: 3, sm: 4 },
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Send
        </Button>
      </Box>
    </Form>
  )
}
