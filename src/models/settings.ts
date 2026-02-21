export enum ColorMode {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface UserSettings {
  colorMode: ColorMode
  userId: string
  customUsername: string
  playSoundOnNewMessage: boolean
  showNotificationOnNewMessage: boolean
  showActiveTypingStatus: boolean
  isEnhancedConnectivityEnabled: boolean
  publicKey: CryptoKeyPair['publicKey']
  privateKey: CryptoKeyPair['privateKey']
  selectedSound: string
}
