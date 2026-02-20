import { useRef, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme'

import UndoIcon from '@mui/icons-material/Undo'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import BrushIcon from '@mui/icons-material/Brush'
import SaveAltIcon from '@mui/icons-material/SaveAlt'

const COLORS = [
    '#64748B',
    '#38BDF8',
    '#FF6B6B',
    '#6BCB77',
    '#FFD93D',
    '#FF9FF3',
    '#FFFFFF',
    '#333333',
]

interface WhiteboardDialogProps {
    open: boolean
    onClose: () => void
}

export const WhiteboardDialog = ({ open, onClose }: WhiteboardDialogProps) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState('#64748B')
    const [brushSize, setBrushSize] = useState(3)
    const [history, setHistory] = useState<ImageData[]>([])

    const getContext = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return null
        return canvas.getContext('2d')
    }, [])

    useEffect(() => {
        if (!open) return
        const canvas = canvasRef.current
        if (!canvas) return

        const parent = canvas.parentElement
        if (!parent) return

        // Set canvas to fill its container
        const rect = parent.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height - 10

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }, [open, isDark])

    const saveState = () => {
        const ctx = getContext()
        const canvas = canvasRef.current
        if (!ctx || !canvas) return
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory(prev => [...prev.slice(-20), imageData])
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const ctx = getContext()
        if (!ctx) return
        saveState()
        const rect = canvasRef.current!.getBoundingClientRect()
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        setIsDrawing(true)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const ctx = getContext()
        if (!ctx) return
        const rect = canvasRef.current!.getBoundingClientRect()
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        const ctx = getContext()
        if (ctx) ctx.closePath()
        setIsDrawing(false)
    }

    const undo = () => {
        const ctx = getContext()
        const canvas = canvasRef.current
        if (!ctx || !canvas || history.length === 0) return
        const lastState = history[history.length - 1]
        ctx.putImageData(lastState, 0, 0)
        setHistory(prev => prev.slice(0, -1))
    }

    const clearCanvas = () => {
        const ctx = getContext()
        const canvas = canvasRef.current
        if (!ctx || !canvas) return
        saveState()
        ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const saveImage = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const link = document.createElement('a')
        link.download = 'nexuschat-whiteboard.png'
        link.href = canvas.toDataURL()
        link.click()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    height: '80vh',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pb: 1,
                }}
            >
                <BrushIcon sx={{ color: 'primary.main' }} />
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
                    Collaborative Whiteboard
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    overflow: 'hidden',
                }}
            >
                {/* Toolbar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 1.5,
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Colors */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {COLORS.map(c => (
                            <Box
                                key={c}
                                onClick={() => setColor(c)}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    backgroundColor: c,
                                    cursor: 'pointer',
                                    border:
                                        color === c
                                            ? '3px solid rgba(100, 116, 139, 0.8)'
                                            : '2px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    {/* Brush Size */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            Size
                        </Typography>
                        <Slider
                            value={brushSize}
                            onChange={(_, v) => setBrushSize(v as number)}
                            min={1}
                            max={20}
                            size="small"
                            sx={{ color: 'primary.main' }}
                        />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                        <Tooltip title="Undo">
                            <IconButton size="small" onClick={undo} disabled={history.length === 0}>
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear">
                            <IconButton size="small" onClick={clearCanvas}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save as image">
                            <IconButton size="small" onClick={saveImage}>
                                <SaveAltIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Canvas */}
                <Box
                    sx={{
                        flex: 1,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${isDark
                                ? 'rgba(100, 116, 139, 0.15)'
                                : 'rgba(0, 0, 0, 0.1)'
                            }`,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        style={{
                            display: 'block',
                            cursor: 'crosshair',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
