import { ColorMode, UserSettings } from 'models/settings'
import { AllowedKeyType, encryption } from 'services/Encryption'

export interface SerializedUserSettings extends Omit<
  UserSettings,
  'publicKey' | 'privateKey'
> {
  publicKey: string
  privateKey: string
}

type UnknownRecord = Record<string, unknown>

const isRecord = (data: unknown): data is UnknownRecord =>
  typeof data === 'object' && data !== null

const hasString = (data: UnknownRecord, key: string) =>
  typeof data[key] === 'string'

const hasBoolean = (data: UnknownRecord, key: string) =>
  typeof data[key] === 'boolean'

const serializedUserSettingsValidators = [
  (data: UnknownRecord) =>
    Object.values(ColorMode).includes(data.colorMode as ColorMode),
  (data: UnknownRecord) => hasString(data, 'userId'),
  (data: UnknownRecord) => hasString(data, 'customUsername'),
  (data: UnknownRecord) => hasBoolean(data, 'playSoundOnNewMessage'),
  (data: UnknownRecord) => hasBoolean(data, 'showNotificationOnNewMessage'),
  (data: UnknownRecord) => hasBoolean(data, 'showActiveTypingStatus'),
  (data: UnknownRecord) => hasBoolean(data, 'isEnhancedConnectivityEnabled'),
  (data: UnknownRecord) => hasString(data, 'selectedSound'),
  (data: UnknownRecord) => hasString(data, 'publicKey'),
  (data: UnknownRecord) => hasString(data, 'privateKey'),
]

export const isSerializedUserSettings = (
  data: unknown
): data is SerializedUserSettings => {
  return (
    isRecord(data) &&
    serializedUserSettingsValidators.every(validator => validator(data))
  )
}

export class SerializationService {
  serializeUserSettings = async (
    userSettings: UserSettings
  ): Promise<SerializedUserSettings> => {
    const {
      publicKey: publicCryptoKey,
      privateKey: privateCryptoKey,
      ...userSettingsRest
    } = userSettings

    const publicKey = await encryption.stringifyCryptoKey(publicCryptoKey)

    const privateKey = await encryption.stringifyCryptoKey(privateCryptoKey)

    return {
      ...userSettingsRest,
      publicKey,
      privateKey,
    }
  }

  deserializeUserSettings = async (
    serializedUserSettings: SerializedUserSettings
  ): Promise<UserSettings> => {
    const {
      publicKey: publicCryptoKeyString,
      privateKey: privateCryptoKeyString,
      ...userSettingsForIndexedDbRest
    } = serializedUserSettings

    const publicKey = await encryption.parseCryptoKeyString(
      publicCryptoKeyString,
      AllowedKeyType.PUBLIC
    )
    const privateKey = await encryption.parseCryptoKeyString(
      privateCryptoKeyString,
      AllowedKeyType.PRIVATE
    )

    return {
      ...userSettingsForIndexedDbRest,
      publicKey,
      privateKey,
    }
  }
}

export const serialization = new SerializationService()
