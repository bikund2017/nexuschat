import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * TURN Server Configuration Handler
 *
 * This handler loads TURN server configuration from the RTC_CONFIG environment variable.
 * The environment variable should contain a base64-encoded JSON string that includes
 * the full RTCConfiguration, but this endpoint extracts and returns only the TURN server.
 *
 * To create the environment variable:
 *
 * RECOMMENDED: Use the helper script to generate the configuration:
 * 1. Run: npm run generate-rtc-config
 * 2. Follow the interactive prompts to configure TURN servers
 * 3. Copy the generated base64 string and set as RTC_CONFIG environment variable
 *
 * ALTERNATIVE: Manual creation:
 * 1. Create your RTCConfiguration object as JSON (including TURN servers)
 * 2. Base64 encode it: Buffer.from(JSON.stringify(config)).toString('base64')
 * 3. Set RTC_CONFIG="<base64-encoded-string>"
 *
 * Example:
 * const config = {
 *   iceServers: [
 *     { urls: 'turn:example.com:3478', username: 'user', credential: 'pass' }
 *   ]
 * }
 * RTC_CONFIG="eyJpY2VTZXJ2ZXJzIjpb..."
 *
 * The endpoint will return only the TURN server configuration:
 * { urls: 'turn:example.com:3478', username: 'user', credential: 'pass' }
 *
 * If the environment variable is missing, malformed, or invalid, the handler
 * will fall back to the default TURN server configuration.
 *
 * CORS SECURITY:
 * By default, this endpoint restricts cross-origin requests to allowed domains only.
 * For debugging purposes, you can override this by setting CORS_ALLOW_ALL="true"
 * to allow requests from any origin (INSECURE - use only for debugging).
 */

// Fallback TURN server configuration in case environment variable is missing or invalid
// 🔒 SECURITY NOTE: These are example credentials for demonstration purposes only.
// In production, you should replace these with your own TURN server credentials
// or ensure that RTC_CONFIG environment variable is properly configured.
const fallbackTurnServer: RTCIceServer = {
  urls: ['turn:relay1.expressturn.com:3478'],
  username: 'efQUQ79N77B5BNVVKF',
  credential: 'N4EAUgpjMzPLrxSS',
}

// Validate URL format for TURN servers
const isValidIceServerUrl = (url: string): boolean => {
  return /^(turn|turns):.+/.test(url)
}

// Validate that the decoded data conforms to RTCConfiguration interface
const isValidRTCConfiguration = (data: any): data is RTCConfiguration => {
  if (!data || typeof data !== 'object') {
    console.error('RTC configuration is not a valid object')
    return false
  }

  if (!Array.isArray(data.iceServers)) {
    console.error('RTC configuration missing iceServers array')
    return false
  }

  if (data.iceServers.length === 0) {
    console.error('RTC configuration has empty iceServers array')
    return false
  }

  // Validate each ice server
  for (const server of data.iceServers) {
    if (!server || typeof server !== 'object') {
      console.error('Invalid ice server object:', server)
      return false
    }

    // urls is required and can be string or string[]
    if (!server.urls) {
      console.error('Ice server missing urls property')
      return false
    }

    if (typeof server.urls !== 'string' && !Array.isArray(server.urls)) {
      console.error('Ice server urls must be string or array of strings')
      return false
    }

    const urlsArray = Array.isArray(server.urls) ? server.urls : [server.urls]

    if (
      !urlsArray.every(
        (url: any) => typeof url === 'string' && isValidIceServerUrl(url)
      )
    ) {
      console.error('Invalid ice server URLs:', urlsArray)
      return false
    }

    // username and credential are optional but if present must be strings
    if (server.username !== undefined && typeof server.username !== 'string') {
      console.error('Ice server username must be a string')
      return false
    }

    if (
      server.credential !== undefined &&
      typeof server.credential !== 'string'
    ) {
      console.error('Ice server credential must be a string')
      return false
    }
  }

  return true
}

// Extract TURN server from RTCConfiguration
const extractTurnServer = (
  rtcConfig: RTCConfiguration
): RTCIceServer | null => {
  if (!rtcConfig.iceServers) {
    return null
  }

  for (const server of rtcConfig.iceServers) {
    const urls = Array.isArray(server.urls) ? server.urls : [server.urls]

    // Check if any of the URLs is a TURN server
    if (urls.some(url => url.startsWith('turn:'))) {
      return server
    }
  }

  return null
}

/**
 * Fetch fresh TURN credentials from the Metered API.
 * Metered credentials are time-limited, so we must fetch them dynamically
 * instead of serving the stale credentials baked into RTC_CONFIG.
 */
const fetchTurnServerFromMetered = async (): Promise<RTCIceServer | null> => {
  const apiKey = process.env.TURN_METERED_API_KEY
  const endpoint = process.env.TURN_METERED_ENDPOINT

  if (!apiKey || !endpoint) {
    console.warn(
      'TURN_METERED_API_KEY or TURN_METERED_ENDPOINT not set. Skipping Metered API fetch.'
    )
    return null
  }

  try {
    const url = `${endpoint}?apiKey=${encodeURIComponent(apiKey)}`
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      console.error(
        `Metered API returned ${response.status} ${response.statusText}. Falling back to static config.`
      )
      return null
    }

    const servers: RTCIceServer[] = await response.json()

    if (!Array.isArray(servers) || servers.length === 0) {
      console.error('Metered API returned empty or invalid server list.')
      return null
    }

    // Pick the first TURN server from the list (prefer TURN over STUN)
    const turnServer = servers.find(s => {
      const urls = Array.isArray(s.urls) ? s.urls : [s.urls]
      return urls.some(
        (u): u is string => typeof u === 'string' && u.startsWith('turn:')
      )
    })

    if (!turnServer) {
      console.error('No TURN server found in Metered API response.')
      return null
    }

    // Return all URLs from metered (they bundle STUN+TURN together)
    console.log('Successfully fetched fresh TURN credentials from Metered API.')
    // Build a single RTCIceServer with all TURN-related URLs from metered
    const allTurnUrls = servers.flatMap(s =>
      (Array.isArray(s.urls) ? s.urls : [s.urls]).filter(
        (u): u is string => typeof u === 'string' && isValidIceServerUrl(u)
      )
    )

    return {
      urls: allTurnUrls,
      username: turnServer.username,
      credential: turnServer.credential,
    } as RTCIceServer
  } catch (error) {
    console.error('Error fetching TURN server from Metered API:', error)
    return null
  }
}

// Load and extract TURN server from the static RTC_CONFIG environment variable
const getTurnServerFromStaticConfig = (): RTCIceServer | null => {
  const rtcConfigEnv = process.env.RTC_CONFIG

  if (!rtcConfigEnv || !rtcConfigEnv.trim()) {
    return null
  }

  try {
    const decodedConfig = Buffer.from(rtcConfigEnv, 'base64').toString('utf-8')

    if (!decodedConfig.trim()) return null

    const parsedConfig = JSON.parse(decodedConfig)

    if (!isValidRTCConfiguration(parsedConfig)) return null

    const turnServer = extractTurnServer(parsedConfig)
    if (turnServer) {
      console.log('Loaded TURN server configuration from static RTC_CONFIG.')
    }
    return turnServer
  } catch (error) {
    console.error('Failed to parse static RTC_CONFIG:', error)
    return null
  }
}

/**
 * Get TURN server with priority:
 * 1. Fresh credentials from Metered API (always up-to-date)
 * 2. Static RTC_CONFIG env var (may be expired)
 * 3. Hardcoded fallback
 */
const getTurnServer = async (): Promise<RTCIceServer> => {
  // Try Metered API first — credentials are time-limited and must be fresh
  const meteredServer = await fetchTurnServerFromMetered()
  if (meteredServer) return meteredServer

  // Fall back to static config (may be expired if credentials are old)
  const staticServer = getTurnServerFromStaticConfig()
  if (staticServer) return staticServer

  // Last resort: hardcoded fallback
  console.warn('Using hardcoded fallback TURN server.')
  return fallbackTurnServer
}

const allowedOrigins = [
  'https://nexuschat-inky.vercel.app',
  'http://localhost:3000', // Development frontend
  'http://localhost:3001', // API development
  'http://localhost:3003', // Simple API server
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`API handler called with method: ${req.method}`)

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log(`Method ${req.method} not allowed, returning 405`)
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Set CORS headers - restrict to same domain for security (unless debug override is enabled)
  if (process.env.CORS_ALLOW_ALL === 'true') {
    // Debug mode: Allow all origins (insecure - for debugging only)
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log('CORS headers set with wildcard origin (DEBUG MODE - INSECURE)')
  } else {
    // Production mode: Restrict to allowed domains
    const origin = req.headers.origin

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    } else {
      // For same-origin requests or allowed deployments, use the primary domain
      res.setHeader(
        'Access-Control-Allow-Origin',
        'https://nexuschat-inky.vercel.app'
      )
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    // Get TURN server — tries Metered API first for fresh credentials,
    // then falls back to static RTC_CONFIG, then hardcoded fallback.
    const turnServer = await getTurnServer()

    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json')

    // Return the TURN server as JSON
    res.status(200).json(turnServer)
  } catch (error) {
    console.error('Unexpected error in API handler:', error)
    res.setHeader('Content-Type', 'application/json')
    res.status(500).json({ error: 'Internal server error' })
  }
}
