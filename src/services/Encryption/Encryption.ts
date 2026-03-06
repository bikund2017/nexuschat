// Web Crypto API utilities for RSA-OAEP encryption.
// References:
//  - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
//  - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey

export enum AllowedKeyType {
  PUBLIC,
  PRIVATE,
}

export class EncryptionError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: unknown
  ) {
    super(`EncryptionError [${operation}]: ${message}`)
    this.name = 'EncryptionError'
  }
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer))
  return btoa(binary)
}

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes.buffer
}

const algorithmName = 'RSA-OAEP'

const algorithmHash = 'SHA-256'

export class EncryptionService {
  cryptoKeyStub: CryptoKey = {
    algorithm: { name: 'STUB-ALGORITHM' },
    extractable: false,
    type: 'private',
    usages: [],
  }

  // TODO: Make this configurable
  generateKeyPair = async (): Promise<CryptoKeyPair> => {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: algorithmName,
          hash: algorithmHash,
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        },
        true,
        ['encrypt', 'decrypt']
      )

      return keyPair
    } catch (e) {
      throw new EncryptionError(
        'Failed to generate key pair. The Web Crypto API may not be available in this environment.',
        'generateKeyPair',
        e
      )
    }
  }

  encodePassword = async (roomId: string, password: string) => {
    try {
      const data = new TextEncoder().encode(`${roomId}_${password}`)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      const bytes = new Uint8Array(digest)
      const encodedPassword = window.btoa(String.fromCharCode(...bytes))

      return encodedPassword
    } catch (e) {
      throw new EncryptionError(
        'Failed to encode password',
        'encodePassword',
        e
      )
    }
  }

  stringifyCryptoKey = async (cryptoKey: CryptoKey) => {
    try {
      const exportedKey = await window.crypto.subtle.exportKey(
        cryptoKey.type === 'public' ? 'spki' : 'pkcs8',
        cryptoKey
      )

      const exportedKeyAsString = arrayBufferToBase64(exportedKey)

      return exportedKeyAsString
    } catch (e) {
      throw new EncryptionError(
        `Failed to stringify ${cryptoKey.type} key`,
        'stringifyCryptoKey',
        e
      )
    }
  }

  parseCryptoKeyString = async (keyString: string, type: AllowedKeyType) => {
    try {
      const importedKey = await window.crypto.subtle.importKey(
        type === AllowedKeyType.PUBLIC ? 'spki' : 'pkcs8',
        base64ToArrayBuffer(keyString),
        {
          name: algorithmName,
          hash: algorithmHash,
        },
        true,
        type === AllowedKeyType.PUBLIC ? ['encrypt'] : ['decrypt']
      )

      return importedKey
    } catch (e) {
      throw new EncryptionError(
        `Failed to parse ${type === AllowedKeyType.PUBLIC ? 'public' : 'private'} key string`,
        'parseCryptoKeyString',
        e
      )
    }
  }

  encryptString = async (publicKey: CryptoKey, plaintext: string) => {
    try {
      const encodedText = new TextEncoder().encode(plaintext)
      const encryptedData = await crypto.subtle.encrypt(
        algorithmName,
        publicKey,
        encodedText
      )

      return encryptedData
    } catch (e) {
      throw new EncryptionError('Failed to encrypt string', 'encryptString', e)
    }
  }

  decryptString = async (privateKey: CryptoKey, encryptedData: ArrayBuffer) => {
    try {
      const decryptedArrayBuffer = await crypto.subtle.decrypt(
        algorithmName,
        privateKey,
        encryptedData
      )

      const decryptedString = new TextDecoder().decode(decryptedArrayBuffer)

      return decryptedString
    } catch (e) {
      throw new EncryptionError(
        'Failed to decrypt string. The key may be incorrect or the data may be corrupted.',
        'decryptString',
        e
      )
    }
  }
}

export const encryption = new EncryptionService()
