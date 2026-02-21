import { useState, SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { communityRoomNames } from 'config/communityRooms'

export const CommunityRoomSelector = () => {
  const navigate = useNavigate()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const handleRoomNameChange = (
    _event: SyntheticEvent<Element, Event>,
    roomName: string | null
  ) => {
    setSelectedRoom(roomName)
  }

  const handleJoinClick = () => {
    navigate(`/public/${selectedRoom}`)
  }

  return (
    <Accordion
      sx={{
        '&.MuiAccordion-root': {
          borderRadius: 2,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          fontWeight: 'bold',
          minHeight: { xs: 40, sm: 48 },
          '& .MuiAccordionSummary-content': {
            my: { xs: 0.75, sm: 1.5 },
          },
        }}
      >
        Community rooms
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 2 } }}>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          You can also chat in a public community room. You'll be anonymous, but
          be careful what information you choose to share.
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Autocomplete
            disablePortal
            options={communityRoomNames}
            value={selectedRoom}
            size="small"
            renderInput={params => <TextField {...params} label="Room" />}
            onChange={handleRoomNameChange}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            size="small"
            disabled={selectedRoom === null}
            onClick={handleJoinClick}
          >
            Join
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
