import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import useTheme from '@mui/material/styles/useTheme'
import PollOutlinedIcon from '@mui/icons-material/PollOutlined'

export interface PollData {
    id: string
    question: string
    options: string[]
    votes: Record<string, string> // peerId -> optionIndex
    creatorId: string
}

interface PollMessageProps {
    poll: PollData
    userId: string
    onVote: (pollId: string, optionIndex: number) => void
}

export const PollMessage = ({ poll, userId, onVote }: PollMessageProps) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const totalVotes = Object.keys(poll.votes).length
    const hasVoted = userId in poll.votes

    const getVoteCount = (optionIndex: number) => {
        return Object.values(poll.votes).filter(
            v => v === String(optionIndex)
        ).length
    }

    return (
        <Box
            className="nexus-fade-in"
            sx={{
                p: 2.5,
                borderRadius: 3,
                mx: 1,
                my: 1,
                background: isDark
                    ? 'rgba(100, 116, 139, 0.08)'
                    : 'rgba(100, 116, 139, 0.04)',
                border: `1px solid ${isDark
                        ? 'rgba(100, 116, 139, 0.15)'
                        : 'rgba(100, 116, 139, 0.1)'
                    }`,
                clear: 'both',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PollOutlinedIcon
                    sx={{ color: 'primary.main', fontSize: '1.2rem' }}
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                    Poll
                </Typography>
            </Box>
            <Typography
                variant="body1"
                sx={{ fontWeight: 600, mb: 2, lineHeight: 1.4 }}
            >
                {poll.question}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {poll.options.map((option, index) => {
                    const voteCount = getVoteCount(index)
                    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

                    return (
                        <Box key={index}>
                            {hasVoted ? (
                                <Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 0.5,
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {option}
                                            {poll.votes[userId] === String(index) && ' ✓'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {Math.round(percentage)}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: isDark
                                                ? 'rgba(255, 255, 255, 0.06)'
                                                : 'rgba(0, 0, 0, 0.06)',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                background:
                                                    poll.votes[userId] === String(index)
                                                        ? 'linear-gradient(135deg, #64748B, #94A3B8)'
                                                        : isDark
                                                            ? 'rgba(255, 255, 255, 0.15)'
                                                            : 'rgba(0, 0, 0, 0.12)',
                                            },
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => onVote(poll.id, index)}
                                    sx={{
                                        textTransform: 'none',
                                        justifyContent: 'flex-start',
                                        borderRadius: 2,
                                        borderColor: isDark
                                            ? 'rgba(100, 116, 139, 0.2)'
                                            : 'rgba(100, 116, 139, 0.15)',
                                        color: 'text.primary',
                                        py: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: 'rgba(100, 116, 139, 0.06)',
                                        },
                                    }}
                                >
                                    {option}
                                </Button>
                            )}
                        </Box>
                    )
                })}
            </Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1.5, display: 'block' }}
            >
                {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </Typography>
        </Box>
    )
}
