// RTCPeerConnection configuration for WebRTC.
// See: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#parameters
export const rtcConfig: RTCConfiguration = {
  // Relay servers used when a direct peer-to-peer connection cannot be made.
  // If you disable relay servers, NEXUSCHAT PEERS MAY NOT BE ABLE TO CONNECT
  // DEPENDING ON HOW THEY ARE CONNECTED TO THE INTERNET.
  iceServers: [
    {
      urls: ['turn:relay1.expressturn.com:3478'],
      username: 'efQUQ79N77B5BNVVKF',
      credential: 'N4EAUgpjMzPLrxSS',
    },
  ],
}
