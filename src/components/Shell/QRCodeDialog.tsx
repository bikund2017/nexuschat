import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { QRCode } from 'react-qrcode-logo'

const QR_CODE_SIZE = 256
const QR_IMAGE_OPACITY = 0.3

export interface QRCodeDialogProps {
  isOpen: boolean
  handleClose: () => void
}

export function QRCodeDialog({ isOpen, handleClose }: QRCodeDialogProps) {
  const url = window.location.href
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Room QR Code
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLocalhost && (
          <Typography
            variant="caption"
            color="warning.main"
            sx={{ display: 'block', mb: 1, textAlign: 'center' }}
          >
            You are on localhost. For other devices to connect, open this page
            using your network IP instead (e.g. https://10.x.x.x:3000).
          </Typography>
        )}
        <QRCode
          value={url}
          size={QR_CODE_SIZE}
          logoImage={'/logo512.png'}
          logoWidth={QR_CODE_SIZE}
          logoHeight={QR_CODE_SIZE}
          logoOpacity={QR_IMAGE_OPACITY}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  )
}
