chrome.webRequest.onBeforeSendHeaders.addListener(
  function getHeaders(details) {
    if (
      details.url.startsWith("https://jbrest.jetblue.com/lfs-rwb/outboundLFS")
    ) {
      console.log(details.requestHeaders);
    }
    // callback();
  },
  { urls: ["https://*.jetblue.com/*"] },
  ["requestHeaders"]
);
