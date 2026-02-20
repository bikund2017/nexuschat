import { useState, useRef, useCallback } from 'react'

interface UseVoiceTranscriptionReturn {
    isRecording: boolean
    transcript: string
    isSupported: boolean
    startRecording: () => void
    stopRecording: () => string
    clearTranscript: () => void
}

export const useVoiceTranscription = (): UseVoiceTranscriptionReturn => {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const recognitionRef = useRef<any>(null)

    // Check for browser support
    const SpeechRecognition =
        typeof window !== 'undefined'
            ? (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition
            : null

    const isSupported = !!SpeechRecognition

    const startRecording = useCallback(() => {
        if (!SpeechRecognition) return

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        let finalTranscript = ''

        recognition.onresult = (event: any) => {
            let interimTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + ' '
                } else {
                    interimTranscript += result[0].transcript
                }
            }
            setTranscript(finalTranscript + interimTranscript)
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsRecording(false)
        }

        recognition.onend = () => {
            setIsRecording(false)
        }

        recognitionRef.current = recognition
        recognition.start()
        setIsRecording(true)
        setTranscript('')
    }, [SpeechRecognition])

    const stopRecording = useCallback((): string => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current = null
        }
        setIsRecording(false)
        return transcript
    }, [transcript])

    const clearTranscript = useCallback(() => {
        setTranscript('')
    }, [])

    return {
        isRecording,
        transcript,
        isSupported,
        startRecording,
        stopRecording,
        clearTranscript,
    }
}
