import 'webrtc-adapter'

// Global handler for unhandled promise rejections to prevent silent failures
window.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    console.error(
      'Unhandled promise rejection:',
      event.reason instanceof Error ? event.reason.message : event.reason
    )
  }
)
