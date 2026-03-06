import { FileTransfer, setStreamSaverMitm } from 'secure-file-transfer'

import { trackerUrls } from 'config/trackerUrls'
import { streamSaverUrl } from 'config/streamSaverUrl'

setStreamSaverMitm(streamSaverUrl)

export class FileTransferService {
  fileTransfer: FileTransfer

  constructor(rtcConfig: RTCConfiguration) {
    try {
      this.fileTransfer = new FileTransfer({
        torrentOpts: {
          announce: trackerUrls,
        },
        webtorrentInstanceOpts: {
          tracker: {
            rtcConfig,
          },
        },
      })
    } catch (e) {
      console.error('Failed to initialize FileTransferService:', e)
      // Initialize with default config as fallback so the app doesn't crash
      this.fileTransfer = new FileTransfer({
        torrentOpts: {
          announce: trackerUrls,
        },
      })
    }
  }
}
