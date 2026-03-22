export type TransferDirection = 'upload' | 'download'

export type TransferStatus =
  | 'preparing'
  | 'encrypting'
  | 'transferring'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface TransferState {
  id: string
  fileName: string
  fileSize: number
  status: TransferStatus
  progress: number // 0-100
  roomId: string
  peerId: string | null
  direction: TransferDirection
  magnetURI: string | null
  createdAt: number
  updatedAt: number
  error?: string
}

export type TransferAction =
  | { type: 'ADD_TRANSFER'; payload: TransferState }
  | {
      type: 'UPDATE_TRANSFER'
      payload: { id: string } & Partial<TransferState>
    }
  | { type: 'REMOVE_TRANSFER'; payload: string }
  | { type: 'LOAD_TRANSFERS'; payload: TransferState[] }
  | { type: 'CLEAR_COMPLETED' }

export function transferReducer(
  state: TransferState[],
  action: TransferAction
): TransferState[] {
  switch (action.type) {
    case 'ADD_TRANSFER':
      return [...state, action.payload]

    case 'UPDATE_TRANSFER': {
      const { id, ...updates } = action.payload
      return state.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      )
    }

    case 'REMOVE_TRANSFER':
      return state.filter(t => t.id !== action.payload)

    case 'LOAD_TRANSFERS':
      return action.payload

    case 'CLEAR_COMPLETED':
      return state.filter(t => t.status !== 'completed')

    default:
      return state
  }
}
