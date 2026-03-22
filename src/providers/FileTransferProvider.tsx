import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import { FileTransferContext } from 'contexts/FileTransferContext'
import { TransferState, transferReducer } from 'models/TransferState'
import { FileTransferService } from 'services/FileTransfer'
import {
  saveAllTransfers,
  getAllTransfers,
  clearCompleted as clearCompletedFromDB,
} from 'services/TransferStore/transferStore'

interface FileTransferProviderProps {
  children: ReactNode
  rtcConfig?: RTCConfiguration
}

export function FileTransferProvider({
  children,
  rtcConfig = {},
}: FileTransferProviderProps) {
  const [transfers, dispatch] = useReducer(transferReducer, [])
  const transfersRef = useRef<TransferState[]>(transfers)

  // Keep ref in sync for use in event handlers
  transfersRef.current = transfers

  const fileTransferService = useMemo(
    () => new FileTransferService(rtcConfig),
    [rtcConfig]
  )

  // Load persisted transfers on mount
  useEffect(() => {
    ;(async () => {
      try {
        const persisted = await getAllTransfers()
        if (persisted.length > 0) {
          // Mark any previously-active transfers as failed (they were interrupted)
          const restored = persisted.map(t => {
            if (
              t.status === 'transferring' ||
              t.status === 'encrypting' ||
              t.status === 'preparing'
            ) {
              return {
                ...t,
                status: 'failed' as const,
                error: 'Transfer interrupted',
              }
            }
            return t
          })
          dispatch({ type: 'LOAD_TRANSFERS', payload: restored })
        }
      } catch (e) {
        console.error('Failed to load persisted transfers:', e)
      }
    })()
  }, [])

  // Persist transfers to IndexedDB on changes
  useEffect(() => {
    if (transfers.length > 0) {
      saveAllTransfers(transfers).catch(e =>
        console.error('Failed to persist transfers:', e)
      )
    }
  }, [transfers])

  // Browser lifecycle: persist state when page becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Persist current state when user switches tabs/apps
        saveAllTransfers(transfersRef.current).catch(e =>
          console.error('Failed to persist transfers on visibility change:', e)
        )
      }
    }

    const handlePageHide = () => {
      // Best-effort persist and cleanup on page unload (mobile-friendly)
      try {
        saveAllTransfers(transfersRef.current)
      } catch (e) {
        console.error('Failed to persist transfers on pagehide:', e)
      }
    }

    const handleBeforeUnload = () => {
      // Attempt cleanup on tab close
      try {
        saveAllTransfers(transfersRef.current)
      } catch (e) {
        console.error('Failed to persist transfers on beforeunload:', e)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Auto-cleanup completed transfers from IndexedDB
  useEffect(() => {
    clearCompletedFromDB().catch(e =>
      console.error('Failed to clear completed transfers:', e)
    )
  }, [])

  const addTransfer = useCallback((transfer: TransferState) => {
    dispatch({ type: 'ADD_TRANSFER', payload: transfer })
  }, [])

  const updateTransfer = useCallback(
    (id: string, updates: Partial<TransferState>) => {
      dispatch({ type: 'UPDATE_TRANSFER', payload: { id, ...updates } })
    },
    []
  )

  const removeTransfer = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TRANSFER', payload: id })
  }, [])

  const getTransfer = useCallback((id: string) => {
    return transfersRef.current.find(t => t.id === id)
  }, [])

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' })
  }, [])

  const contextValue = useMemo(
    () => ({
      transfers,
      dispatch,
      fileTransferService,
      addTransfer,
      updateTransfer,
      removeTransfer,
      getTransfer,
      clearCompleted,
    }),
    [
      transfers,
      fileTransferService,
      addTransfer,
      updateTransfer,
      removeTransfer,
      getTransfer,
      clearCompleted,
    ]
  )

  return (
    <FileTransferContext.Provider value={contextValue}>
      {children}
    </FileTransferContext.Provider>
  )
}
