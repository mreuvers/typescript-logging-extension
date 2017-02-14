function sendMessageToPanel(data) {
  RCT.messageProcessor.processMessage(data);
}

function sendMessageToDevTools(msg) {
  chrome.runtime.sendMessage(null, msg);
}
