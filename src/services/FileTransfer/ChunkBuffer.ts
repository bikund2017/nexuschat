export interface ChunkBufferConfig {
  chunkSize: number       // Size of each chunk in bytes (default: 64KB)
  maxBufferedChunks: number // Max chunks in-flight (default: 8)
  onProgress?: (bytesTransferred: number, totalBytes: number) => void
}

const DEFAULT_CHUNK_SIZE = 64 * 1024       // 64KB
const DEFAULT_MAX_BUFFERED = 8

export class ChunkBuffer {
  private buffer: ArrayBuffer[] = []
  private bytesTransferred = 0
  private totalBytes: number
  private chunkSize: number
  private maxBufferedChunks: number
  private onProgress?: (bytesTransferred: number, totalBytes: number) => void
  private isPaused = false

  constructor(totalBytes: number, config?: Partial<ChunkBufferConfig>) {
    this.totalBytes = totalBytes
    this.chunkSize = config?.chunkSize ?? DEFAULT_CHUNK_SIZE
    this.maxBufferedChunks = config?.maxBufferedChunks ?? DEFAULT_MAX_BUFFERED
    this.onProgress = config?.onProgress
  }

  get isFull(): boolean {
    return this.buffer.length >= this.maxBufferedChunks
  }

  get isEmpty(): boolean {
    return this.buffer.length === 0
  }

  get bufferedCount(): number {
    return this.buffer.length
  }

  get progress(): number {
    if (this.totalBytes === 0) return 100
    return Math.min(100, Math.round((this.bytesTransferred / this.totalBytes) * 100))
  }

  get transferred(): number {
    return this.bytesTransferred
  }

  get paused(): boolean {
    return this.isPaused
  }

  getChunkSize(): number {
    return this.chunkSize
  }

  push(chunk: ArrayBuffer): boolean {
    if (this.isFull) {
      return false // Backpressure: caller should wait
    }

    this.buffer.push(chunk)
    return true
  }

  pull(): ArrayBuffer | null {
    const chunk = this.buffer.shift() ?? null

    if (chunk) {
      this.bytesTransferred += chunk.byteLength
      this.onProgress?.(this.bytesTransferred, this.totalBytes)
    }

    return chunk
  }

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  reset(): void {
    this.buffer = []
    this.bytesTransferred = 0
    this.isPaused = false
  }

  destroy(): void {
    this.buffer = []
    this.onProgress = undefined
  }

  /**
   * Slice a File/Blob into chunks and process them via a callback.
   * Respects backpressure — waits when buffer is full.
   */
  async processFile(
    file: File,
    processChunk: (chunk: ArrayBuffer, index: number) => Promise<void>
  ): Promise<void> {
    const totalChunks = Math.ceil(file.size / this.chunkSize)

    for (let i = 0; i < totalChunks; i++) {
      if (this.isPaused) {
        // Wait until resumed
        await this.waitForResume()
      }

      // Wait for buffer space
      while (this.isFull) {
        await this.sleep(10)
      }

      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, file.size)
      const blob = file.slice(start, end)
      const chunk = await blob.arrayBuffer()

      this.push(chunk)
      await processChunk(chunk, i)

      const pulled = this.pull()
      if (pulled) {
        // Progress is already updated in pull()
      }
    }
  }

  private async waitForResume(): Promise<void> {
    while (this.isPaused) {
      await this.sleep(50)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
