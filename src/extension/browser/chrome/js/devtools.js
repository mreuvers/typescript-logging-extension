var evalValueRegister = 'window.postMessage(' + JSON.stringify({
  from: "tsl-extension",
  data: {type: "register", value: null}
}) + ', "*");';

var windowMainPanel = null;
var registered = false;
var hidden = true;

var currentURL;
var lastKnownURL = null;

function setCurrentURL(fn) {
  chrome.devtools.inspectedWindow.eval(
    "window.location.href", function(result) {
      currentURL = result;
      if(fn != null) {
        fn(currentURL);
      }
    }
  );
}

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
            if (windowMainPanel !== null) {
              windowMainPanel.sendMessageToPanel(message);
            }
            else {
              data.push(message);
            }
            break;
          case 'chrome-extension-background': // special from background page, register again.
            if (!hidden) {
              var callback = function() {
                var restoreState = false;

                // Still same url we know, that means we can try reusing the current category settings.
                if(currentURL !== null && lastKnownURL !== null && currentURL === lastKnownURL) {
                  restoreState = true;
                  windowMainPanel.sendMessageToPanel({from: "tsl-devtools", data: {type: "saveCategoryStateAndClear" }});
                }
                else {
                  windowMainPanel.sendMessageToPanel({from: "tsl-devtools", data: {type: "clear" }});
                }
                lastKnownURL = currentURL;

                console.log("Not hidden, will evaluate: " + evalValueRegister);

                chrome.devtools.inspectedWindow.eval(
                  evalValueRegister
                );

                // Now restore state if any
                if(restoreState) {
                  windowMainPanel.sendMessageToPanel({from: "tsl-devtools", data: {type : "restoreState"}});
                }
              };
              setCurrentURL(callback);
            }
            break;
          default:
            console.log("devtools (port.onMessage): Unknown message, dropping - from=" + message.from);
            break;
        }
      }
    });


    extensionPanel.onShown.addListener(function (panelWindow) {
      hidden = false;
      windowMainPanel = panelWindow;

      // Release queued data to send to panel (if any)
      data.forEach(function (d) {
        windowMainPanel.sendMessageToPanel(d);
      });

      setCurrentURL(function(newUrl) {
        lastKnownURL = newUrl;
      });

      // Enable the integration by calling the framework.
      if (!registered) {
        console.log("Will evaluate: " + evalValueRegister);

        chrome.devtools.inspectedWindow.eval(
          evalValueRegister
        );
        registered = true;
      }
      else {
        console.log("Already registered previously");
      }
    });

    extensionPanel.onHidden.addListener(function(panelWindow) {
      hidden = true;
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

