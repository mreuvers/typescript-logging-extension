// FYI: To not get immensely frustrated as if the background page is not working,
// console messages are logged to the background page SEPARATELY, the docs just suck..
// Find it under extensions, and then click the background page there (must be in dev mode)...
var ports = [];

chrome.extension.onConnect.addListener(function (port) {

  if (port.name !== "devtools") {
    console.log("Ignoring port: " + port.name);
    return;
  }

  ports.push(port);


  port.onDisconnect.addListener(function() {
    var i = ports.indexOf(port);
    if (i !== -1) {
      ports.splice(i, 1);
    }
  });

  port.onMessage.addListener(function(msg) {
    // Received message from devtools. Do something (we currently don't but leaving it here).
    console.log('Received message from devtools page:' + msg);
  });

});

// To receive from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  notifyDevtools(message);
});

// Function to send a message to devtools views.
function notifyDevtools(msg) {
  ports.forEach(function(port) {
    port.postMessage(msg);
  });
}