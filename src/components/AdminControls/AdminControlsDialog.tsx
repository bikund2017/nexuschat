import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import useTheme from '@mui/material/styles/useTheme'

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'

export interface AdminSettings {
    muteAll: boolean
    lockRoom: boolean
    slowMode: boolean
    slowModeInterval: number // seconds
    allowMediaSharing: boolean
    allowPolls: boolean
}

interface AdminControlsDialogProps {
    open: boolean
    onClose: () => void
    settings: AdminSettings
    onSettingsChange: (settings: AdminSettings) => void
    isAdmin: boolean
}

const defaultSettings: AdminSettings = {
    muteAll: false,
    lockRoom: false,
    slowMode: false,
    slowModeInterval: 5,
    allowMediaSharing: true,
    allowPolls: true,
}

export const AdminControlsDialog = ({
    open,
    onClose,
    settings = defaultSettings,
    onSettingsChange,
    isAdmin,
}: AdminControlsDialogProps) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const handleToggle = (key: keyof AdminSettings) => {
        onSettingsChange({
            ...settings,
            [key]: !settings[key],
        })
    }

    const controls = [
        {
            key: 'lockRoom' as const,
            label: 'Lock Room',
            description: 'Prevent new peers from joining',
        },
        {
            key: 'muteAll' as const,
            label: 'Mute All',
            description: 'Mute all participants',
        },
        {
            key: 'slowMode' as const,
            label: 'Slow Mode',
            description: `Limit messages to one per ${settings.slowModeInterval}s`,
        },
        {
            key: 'allowMediaSharing' as const,
            label: 'Allow Media Sharing',
            description: 'Allow peers to share images and files',
        },
        {
            key: 'allowPolls' as const,
            label: 'Allow Polls',
            description: 'Allow peers to create polls',
        },
    ]

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    ...(isDark && {
                        background: 'rgba(17, 22, 56, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(100, 116, 139, 0.15)',
                    }),
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettingsOutlinedIcon sx={{ color: 'primary.main' }} />
                <Typography
                    variant="h6"
                    component="span"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #64748B, #38BDF8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Admin Controls
                </Typography>
            </DialogTitle>
            <DialogContent>
                {!isAdmin && (
                    <Box
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            border: '1px solid rgba(255, 107, 107, 0.2)',
                        }}
                    >
                        <Typography variant="body2" color="error.main">
                            Only the room creator has admin privileges. These controls are
                            view-only.
                        </Typography>
                    </Box>
                )}
                <List disablePadding>
                    {controls.map((control, index) => (
                        <Box key={control.key}>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary={control.label}
                                    secondary={control.description}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={
                                            typeof settings[control.key] === 'boolean'
                                                ? (settings[control.key] as boolean)
                                                : false
                                        }
                                        onChange={() => handleToggle(control.key)}
                                        disabled={!isAdmin}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < controls.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
