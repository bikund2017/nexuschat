export const streamSaverUrl =
  import.meta.env.VITE_STREAMSAVER_URL ??
  // StreamSaver.js MITM page for enabling large file downloads.
  // See: https://github.com/jimmywarting/StreamSaver.js#configuration
  'https://jimmywarting.github.io/StreamSaver.js/mitm.html'
