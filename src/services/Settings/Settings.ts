import { saveAs } from 'file-saver'

import { UserSettings } from 'models/settings'
import { encryption } from 'services/Encryption'
import {
  isSerializedUserSettings,
  serialization,
} from 'services/Serialization/Serialization'

class InvalidFileError extends Error {
  message = 'InvalidFileError: File could not be imported'
}

class InvalidKeyPairError extends Error {
  message =
    'InvalidKeyPairError: The public and private keys in the imported file are not compatible'
}

class FileReadError extends Error {
  message = 'FileReadError: Unable to read the file contents'
}

const encryptionTestTarget = 'nexuschat'

export class SettingsService {
  exportSettings = async (userSettings: UserSettings) => {
    const serializedUserSettings =
      await serialization.serializeUserSettings(userSettings)

    const blob = new Blob([JSON.stringify(serializedUserSettings)], {
      type: 'application/json;charset=utf-8',
    })

    saveAs(blob, `nexuschat-profile-${userSettings.userId}.json`)
  }

  importSettings = async (file: File) => {
    const fileReader = new FileReader()

    const promise = new Promise<UserSettings>((resolve, reject) => {
      fileReader.addEventListener('error', () => {
        reject(new FileReadError())
      })

      fileReader.addEventListener('loadend', async evt => {
        try {
          const fileReaderResult = evt.target?.result

          if (typeof fileReaderResult !== 'string') {
            throw new FileReadError()
          }

          let parsedFileResult: unknown
          try {
            parsedFileResult = JSON.parse(fileReaderResult)
          } catch (_e) {
            throw new InvalidFileError()
          }

          if (!isSerializedUserSettings(parsedFileResult)) {
            throw new InvalidFileError()
          }

          const deserializedUserSettings =
            await serialization.deserializeUserSettings(parsedFileResult)

          const encryptedString = await encryption.encryptString(
            deserializedUserSettings.publicKey,
            encryptionTestTarget
          )

          const decryptedString = await encryption.decryptString(
            deserializedUserSettings.privateKey,
            encryptedString
          )

          // NOTE: This determines whether the public and private keys match
          // and are compatible with NexusChat.
          if (decryptedString !== encryptionTestTarget) {
            throw new InvalidKeyPairError()
          }

          resolve(deserializedUserSettings)
        } catch (e) {
          if (
            e instanceof InvalidFileError ||
            e instanceof InvalidKeyPairError ||
            e instanceof FileReadError
          ) {
            console.error(e)
            reject(e)
          } else {
            const err = new InvalidFileError()
            console.error(err, e)
            reject(err)
          }
        }
      })

      fileReader.readAsText(file.slice())
    })

    return promise
  }
}

export const settings = new SettingsService()
