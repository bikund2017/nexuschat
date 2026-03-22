import { createContext, Dispatch } from 'react'
import { TransferState, TransferAction } from 'models/TransferState'
import { FileTransferService } from 'services/FileTransfer'

export interface FileTransferContextProps {
  transfers: TransferState[]
  dispatch: Dispatch<TransferAction>
  fileTransferService: FileTransferService
  addTransfer: (transfer: TransferState) => void
  updateTransfer: (id: string, updates: Partial<TransferState>) => void
  removeTransfer: (id: string) => void
  getTransfer: (id: string) => TransferState | undefined
  clearCompleted: () => void
}

export const FileTransferContext = createContext<FileTransferContextProps>({
  transfers: [],
  dispatch: () => {},
  fileTransferService: new FileTransferService({}),
  addTransfer: () => {},
  updateTransfer: () => {},
  removeTransfer: () => {},
  getTransfer: () => undefined,
  clearCompleted: () => {},
})
