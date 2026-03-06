import { Component, ErrorInfo, ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  children?: ReactNode
}

interface State {
  error: Error | null
  showError: boolean
}

// Adapted from https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
    showError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { error, showError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleDismiss = () => {
    this.setState({ error: null, showError: false })
  }

  private handleReload = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.error && this.state.showError) {
      const { name, message, stack } = this.state.error

      return (
        <Box sx={{ p: 2 }}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={this.handleDismiss}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography variant="h5" component="pre" sx={{ mb: 1 }}>
              {name}
            </Typography>
            <Typography variant="body1" component="code" sx={{ mb: 1 }}>
              {message}
            </Typography>
            {import.meta.env.DEV && stack && (
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  mt: 1,
                  maxHeight: '300px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                }}
              >
                {stack}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={this.handleDismiss}
              >
                Dismiss
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={this.handleReload}
              >
                Reload App
              </Button>
            </Box>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
