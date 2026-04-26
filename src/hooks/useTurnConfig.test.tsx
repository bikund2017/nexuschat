import { vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { useTurnConfig } from './useTurnConfig'

// Mock the enhanced connectivity config module
const mockEnhancedConnectivity = vi.hoisted(() => ({
  isEnhancedConnectivityAvailable: true,
  getValidatedRtcConfigEndpoint: (): string | null => '/api/get-config',
}))
vi.mock('config/enhancedConnectivity', () => mockEnhancedConnectivity)

const mockTurnServer = {
  urls: ['turn:relay1.expressturn.com:3478'],
  username: 'efQUQ79N77B5BNVVKF',
  credential: 'N4EAUgpjMzPLrxSS',
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  })

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTurnConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock to true by default
    mockEnhancedConnectivity.isEnhancedConnectivityAvailable = true
    mockEnhancedConnectivity.getValidatedRtcConfigEndpoint = () =>
      '/api/get-config'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // The baseline STUN servers always included in iceServers
  const stunServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stunserver.stunprotocol.org:3478' },
  ]

  test('fetches TURN server successfully and adds it after STUN servers', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(mockTurnServer),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(false)
    // STUN servers are always first, then TURN server is appended
    expect(result.current.turnConfig).toEqual({
      iceServers: [...stunServers, mockTurnServer],
    })
    expect(global.fetch).toHaveBeenCalledWith('/api/get-config', {
      signal: expect.any(AbortSignal),
      headers: {
        Accept: 'application/json',
      },
    })
  })

  test('returns only STUN servers when API fails', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 3000 }
    )

    expect(result.current.isError).toBe(true)
    // STUN servers are always present even when TURN fetch fails
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })

  test('returns only STUN servers when API returns non-200 status', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 3000 }
    )

    expect(result.current.isError).toBe(true)
    // STUN servers are always present even when TURN API returns error
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })

  test('returns only STUN servers when API returns non-JSON content', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('text/html'),
      },
      text: vi.fn().mockResolvedValue('<html>Error page</html>'),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 3000 }
    )

    expect(result.current.isError).toBe(true)
    // STUN servers are always present even when TURN API returns wrong content type
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })

  test('returns only STUN servers when API returns invalid RTCIceServer object', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(null),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 3000 }
    )

    expect(result.current.isError).toBe(true)
    // STUN servers are always present even when TURN API returns invalid data
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })

  test('accepts valid RTCIceServer object with urls as array and appends after STUN', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    const validTurnServerWithArray = {
      urls: [
        'turn:relay1.expressturn.com:3478',
        'turn:relay2.expressturn.com:3478',
      ],
      username: 'testuser',
      credential: 'testpass',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(validTurnServerWithArray),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(false)
    const servers = result.current.turnConfig.iceServers!
    // STUN servers come first, TURN server is appended at the end
    expect(servers.slice(0, stunServers.length)).toEqual(stunServers)
    expect(servers[stunServers.length]).toEqual(validTurnServerWithArray)
  })

  test('accepts valid RTCIceServer object with minimal properties (only urls) and appends after STUN', async () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    const minimalTurnServer = {
      urls: ['turn:relay1.expressturn.com:3478'],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(minimalTurnServer),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(false)
    const servers = result.current.turnConfig.iceServers!
    // STUN servers come first, TURN server is appended at the end
    expect(servers.slice(0, stunServers.length)).toEqual(stunServers)
    expect(servers[stunServers.length]).toEqual(minimalTurnServer)
  })

  test('uses custom RTC config endpoint from environment variable', async () => {
    mockEnhancedConnectivity.getValidatedRtcConfigEndpoint = ():
      | string
      | null => '/api/custom-rtc-config'

    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(mockTurnServer),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/custom-rtc-config', {
      signal: expect.any(AbortSignal),
      headers: {
        Accept: 'application/json',
      },
    })
    // STUN servers come first, then the fetched TURN server
    expect(result.current.turnConfig).toEqual({
      iceServers: [...stunServers, mockTurnServer],
    })
  })

  test('uses absolute URL RTC config endpoint from environment variable', async () => {
    mockEnhancedConnectivity.getValidatedRtcConfigEndpoint = ():
      | string
      | null => 'https://api.example.com/rtc-config'

    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json'),
      },
      json: vi.fn().mockResolvedValue(mockTurnServer),
    })

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/rtc-config',
      {
        signal: expect.any(AbortSignal),
        headers: {
          Accept: 'application/json',
        },
      }
    )
    // STUN servers come first, then the fetched TURN server
    expect(result.current.turnConfig).toEqual({
      iceServers: [...stunServers, mockTurnServer],
    })
  })

  test('skips API request when enableApiRequest is false, returns only STUN servers', () => {
    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn()

    const { result } = renderHook(() => useTurnConfig(false), { wrapper })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    // STUN servers are always present even when API request is disabled
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })

  test('skips API request when enhanced connectivity is not available, returns only STUN servers', () => {
    mockEnhancedConnectivity.isEnhancedConnectivityAvailable = false

    const queryClient = createTestQueryClient()
    const wrapper = createWrapper(queryClient)

    global.fetch = vi.fn()

    const { result } = renderHook(() => useTurnConfig(), { wrapper })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    // STUN servers are always present even when enhanced connectivity is disabled
    expect(result.current.turnConfig).toEqual({ iceServers: stunServers })
  })
})
