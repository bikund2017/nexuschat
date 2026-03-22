import { openDB, IDBPDatabase } from 'idb'
import { TransferState } from 'models/TransferState'

const DB_NAME = 'nexuschat-transfers'
const DB_VERSION = 1
const STORE_NAME = 'transfers'
const COMPLETED_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('status', 'status', { unique: false })
          store.createIndex('roomId', 'roomId', { unique: false })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      },
    })
  }
  return dbPromise
}

export async function saveTransfer(transfer: TransferState): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, transfer)
}

export async function getTransfer(
  id: string
): Promise<TransferState | undefined> {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function getAllTransfers(): Promise<TransferState[]> {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export async function getTransfersByRoom(
  roomId: string
): Promise<TransferState[]> {
  const db = await getDB()
  return db.getAllFromIndex(STORE_NAME, 'roomId', roomId)
}

export async function deleteTransfer(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function clearCompleted(): Promise<void> {
  const db = await getDB()
  const now = Date.now()
  const all = await db.getAll(STORE_NAME)

  const tx = db.transaction(STORE_NAME, 'readwrite')

  for (const transfer of all) {
    if (
      transfer.status === 'completed' &&
      now - transfer.updatedAt > COMPLETED_TTL_MS
    ) {
      await tx.store.delete(transfer.id)
    }
  }

  await tx.done
}

export async function saveAllTransfers(
  transfers: TransferState[]
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')

  for (const transfer of transfers) {
    await tx.store.put(transfer)
  }

  await tx.done
}

export async function clearAllTransfers(): Promise<void> {
  const db = await getDB()
  await db.clear(STORE_NAME)
}
