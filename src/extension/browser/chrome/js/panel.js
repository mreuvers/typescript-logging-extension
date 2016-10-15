
window.addEventListener("message", function(event) {

  var data = event.data;
  if(data.from && data.from === 'tsl-logging') {
    sendMessageToPanel(data);
  }
});

function sendMessageToPanel(data) {
  RCT.messageProcessor.processMessage(data);
}

function sendMessageToDevTools(msg) {
  chrome.runtime.sendMessage(null, msg);
}
