let trackerUrls: string[] | undefined = [
  // WebTorrent tracker URLs for peer discovery.
  // These are provided to the peer-to-peer signaling layer.
]

// If a tracker URL has been provided via the VITE_TRACKER_URL environment
// variable, prioritize using it. This is mainly relevant for local development
// when using the `npm run dev` script.
if (import.meta.env.VITE_TRACKER_URL) {
  trackerUrls.unshift(import.meta.env.VITE_TRACKER_URL)
}

// If no tracker URL overrides have been provided, set trackerUrls to undefined
// to allow the signaling library to use its default list.
if (!trackerUrls.length) {
  trackerUrls = undefined
}

export { trackerUrls }
