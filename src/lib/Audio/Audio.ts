export class Audio {
  private audioContext: AudioContext | null = null

  private audioBuffer: AudioBuffer | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new AudioContext()
    }
    return this.audioContext
  }

  constructor(audioDataUrl?: string) {
    if (audioDataUrl) {
      this.load(audioDataUrl)
    }
  }

  load = async (audioDataUrl: string) => {
    try {
      const response = await fetch(audioDataUrl)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio: ${response.status} ${response.statusText}`
        )
      }

      const arrayBuffer = await response.arrayBuffer()
      const context = this.getAudioContext()
      this.audioBuffer = await context.decodeAudioData(arrayBuffer)
    } catch (e) {
      console.error('Audio load failed:', e)
    }
  }

  play = () => {
    if (this.audioBuffer === null) {
      console.error('Audio buffer not available')
      return
    }

    try {
      const context = this.getAudioContext()

      // Resume AudioContext if it was suspended (e.g., due to autoplay policy)
      if (context.state === 'suspended') {
        context.resume().catch(e => {
          console.error('Failed to resume AudioContext:', e)
        })
      }

      const audioSource = context.createBufferSource()
      audioSource.buffer = this.audioBuffer
      audioSource.connect(context.destination)
      audioSource.start()
    } catch (e) {
      console.error('Audio playback failed:', e)
    }
  }

  dispose = () => {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(e => {
        console.error('Failed to close AudioContext:', e)
      })
    }
    this.audioContext = null
    this.audioBuffer = null
  }
}
