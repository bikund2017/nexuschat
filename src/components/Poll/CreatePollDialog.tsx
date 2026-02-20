import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import useTheme from '@mui/material/styles/useTheme'

interface CreatePollDialogProps {
    open: boolean
    onClose: () => void
    onCreatePoll: (question: string, options: string[]) => void
}

export const CreatePollDialog = ({
    open,
    onClose,
    onCreatePoll,
}: CreatePollDialogProps) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])

    const handleAddOption = () => {
        if (options.length < 6) {
            setOptions([...options, ''])
        }
    }

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const isValid =
        question.trim().length > 0 &&
        options.filter(o => o.trim().length > 0).length >= 2

    const handleCreate = () => {
        const validOptions = options.filter(o => o.trim().length > 0)
        onCreatePoll(question.trim(), validOptions)
        setQuestion('')
        setOptions(['', ''])
        onClose()
    }

    const handleClose = () => {
        setQuestion('')
        setOptions(['', ''])
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #64748B, #38BDF8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                📊 Create a Poll
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label="Question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    sx={{ mt: 1, mb: 2 }}
                    placeholder="What do you want to ask?"
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                >
                    Options (min 2, max 6)
                </Typography>
                {options.map((option, index) => (
                    <Box
                        key={index}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            label={`Option ${index + 1}`}
                            value={option}
                            onChange={e => handleOptionChange(index, e.target.value)}
                        />
                        {options.length > 2 && (
                            <IconButton
                                size="small"
                                onClick={() => handleRemoveOption(index)}
                                sx={{ color: 'error.main' }}
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
                {options.length < 6 && (
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddOption}
                        size="small"
                        sx={{ mt: 0.5, textTransform: 'none' }}
                    >
                        Add Option
                    </Button>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!isValid}
                >
                    Create Poll
                </Button>
            </DialogActions>
        </Dialog>
    )
}
