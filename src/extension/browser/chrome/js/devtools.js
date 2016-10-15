var windowMainPanel = null;

chrome.devtools.panels.create("Logging",
  "images/icon.png",
  "panel.html",
  function(extensionPanel) {


    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});


    port.onMessage.addListener(function (message) {

      if(message.from) {
        switch (message.from) {
          // From tsl-extension (us), must be send to the logger framework.
          case 'tsl-extension':
            chrome.devtools.inspectedWindow.eval(
              "TSL.ExtensionHelper.processMessageFromExtension(" + JSON.stringify(message) + ");"
            );
            break;
          case 'tsl-logging':
            // From the logging framework, send to panel (or store)
            if(windowMainPanel != null) {
              windowMainPanel.sendMessageToPanel(message);
            }
            else {
              data.push(message);
            }
            break;
          default:
            console.log("devtools (port.onMessage): Unknown message (from) " + message.from);
            break;
        }
      }
    });


    extensionPanel.onShown.addListener(function tmp(panelWindow) {
      // Run once only
      extensionPanel.onShown.removeListener(tmp);

      windowMainPanel = panelWindow;

      // Release queued data to send to panel (if any)
      data.forEach(function(d) {
        windowMainPanel.sendMessageToPanel(d);
      });

      // Enable the integration by calling the framework.
      chrome.devtools.inspectedWindow.eval(
        "TSL.ExtensionHelper.enableExtensionIntegration();"
      );
    });
  }
);

// To receive messages from content script (which gets it from the inspected page), so it must always be tsl-logging messaging us!
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if(message.from) {
    switch(message.from) {
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

