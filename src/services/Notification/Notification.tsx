export class NotificationService {
  permission: NotificationPermission = 'default'

  private get isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  requestPermission = async () => {
    if (!this.isSupported) {
      console.warn(
        'Notification API is not supported in this environment. Desktop notifications will be unavailable.'
      )
      return
    }

    if (this.permission === 'granted') return

    try {
      this.permission = await Notification.requestPermission()
    } catch (e) {
      console.error('Failed to request notification permission:', e)
    }
  }

  showNotification = (message: string, options?: NotificationOptions) => {
    if (!this.isSupported) return
    if (this.permission !== 'granted') return

    try {
      new Notification(message, options)
    } catch (e) {
      console.error('Failed to show notification:', e)
    }
  }
}

export const notification = new NotificationService()
