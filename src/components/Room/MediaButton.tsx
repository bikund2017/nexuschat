import Fab, { FabProps } from '@mui/material/Fab'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { forwardRef } from 'react'

interface MediaButtonProps extends Partial<FabProps> {
  isActive: boolean
}

export const MediaButton = forwardRef<HTMLButtonElement, MediaButtonProps>(
  ({ isActive, ...props }: MediaButtonProps, ref) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
      <Fab
        {...props}
        ref={ref}
        size={isMobile ? 'small' : 'medium'}
        sx={muiTheme =>
          muiTheme.palette.mode === 'dark'
            ? isActive
              ? {
                  color: muiTheme.palette.common.white,
                  background: muiTheme.palette.success.main,
                  '&:hover': {
                    background: muiTheme.palette.success.dark,
                  },
                }
              : {
                  background: muiTheme.palette.grey[500],
                  '&:hover': {
                    background: muiTheme.palette.grey[600],
                  },
                }
            : isActive
              ? {
                  color: muiTheme.palette.common.white,
                  background: muiTheme.palette.success.main,
                  '&:hover': {
                    background: muiTheme.palette.success.dark,
                  },
                }
              : {
                  color: muiTheme.palette.common.black,
                  background: muiTheme.palette.grey[400],
                  '&:hover': {
                    background: muiTheme.palette.grey[500],
                  },
                }
        }
      />
    )
  }
)
