var windowMainPanel = null;
var registered = false;

chrome.devtools.panels.create("Logging",
  "images/icon.png",
  "panel.html",
  function (extensionPanel) {


    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});

    port.onMessage.addListener(function (message) {

      if (message.from) {
        switch (message.from) {
          // From tsl-extension (us), must be send to the logger framework.
          case 'tsl-extension':
            var evalValue = 'window.postMessage(' + JSON.stringify(message) + ', "*");';
            chrome.devtools.inspectedWindow.eval(
              evalValue
            );
            break;
          case 'tsl-logging':
            // From the logging framework, send to panel (or store)
            if (windowMainPanel != null) {
              windowMainPanel.sendMessageToPanel(message);
            }
            else {
              data.push(message);
            }
            break;
          default:
            console.log("devtools (port.onMessage): Unknown message, dropping - from=" + message.from);
            break;
        }
      }
    });


    extensionPanel.onShown.addListener(function tmp(panelWindow) {
      windowMainPanel = panelWindow;

      // Run once only
      extensionPanel.onShown.removeListener(tmp);

      // Release queued data to send to panel (if any)
      data.forEach(function (d) {
        windowMainPanel.sendMessageToPanel(d);
      });

      // Enable the integration by calling the framework.
      if (!registered) {
        var evalValue = 'window.postMessage(' + JSON.stringify({
            from: "tsl-extension",
            data: {type: "register", value: null}
          }) + ', "*");';
        console.log("Will evaluate: " + evalValue);
        chrome.devtools.inspectedWindow.eval(
          evalValue
        );
        registered = true;
      }
      else {
        console.log("Already registered previously");
      }
    });
  }
);

// To receive messages from content script (which gets it from the inspected page), so it must always be tsl-logging messaging us!
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.from) {
    switch (message.from) {
      case 'tsl-logging':
        // Send to panel (it's from the framework)
        windowMainPanel.sendMessageToPanel(message);
        break;
      default:
        console.log("(devtools) Dropping message from: " + message.from);
        break;
    }
  }
  else {
    console.log("(devtools) Dropping unsupported message");
  }

});

