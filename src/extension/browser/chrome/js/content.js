window.addEventListener("message", function(event) {

  // Send to background page, but only if it's us. Other messages should be ignored.
  if(event.data && event.data.from && event.data.from !== 'tsl-extension') {
    chrome.runtime.sendMessage(null, event.data);
  }
});
