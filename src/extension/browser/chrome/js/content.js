window.addEventListener("message", function(event) {

  // Send to background page
  chrome.runtime.sendMessage(null, event.data);

});
