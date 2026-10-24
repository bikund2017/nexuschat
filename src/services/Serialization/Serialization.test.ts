import { describe, expect, test } from 'vitest'

import { ColorMode } from 'models/settings'

import {
  isSerializedUserSettings,
  SerializedUserSettings,
} from './Serialization'

const validSettings: SerializedUserSettings = {
  colorMode: ColorMode.DARK,
  userId: 'user-id',
  customUsername: 'Nexus user',
  playSoundOnNewMessage: true,
  showNotificationOnNewMessage: true,
  showActiveTypingStatus: true,
  isEnhancedConnectivityEnabled: false,
  selectedSound: 'beep',
  publicKey: 'public-key',
  privateKey: 'private-key',
}

describe('isSerializedUserSettings', () => {
  test('accepts settings with every required persisted field', () => {
    expect(isSerializedUserSettings(validSettings)).toBe(true)
  })

  test('rejects settings without selectedSound', () => {
    const { selectedSound: _, ...settingsWithoutSound } = validSettings

    expect(isSerializedUserSettings(settingsWithoutSound)).toBe(false)
  })

  test('rejects non-object input', () => {
    expect(isSerializedUserSettings(null)).toBe(false)
    expect(isSerializedUserSettings('settings')).toBe(false)
  })
})
