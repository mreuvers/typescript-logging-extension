# typescript-logging-extension

This project is a browser extension, currently for Chrome only, to add a logging tab to the developer console if [typescript-logging](https://github.com/mreuvers/typescript-logging) is used by the application.
The extension allows to easily change logging levels dynamically and (text) filtering. Your application should use [typescript-logging](https://github.com/mreuvers/typescript-logging) (at least version 0.2.0-beta6)
in order for the extension to be useful, for details on that project visit the page.

Supports categorized style of logging from typescript-logging, in the future will support the log4j style of logging as well.

## Installation

Start Chrome and visit the [Chrome web store](https://chrome.google.com/webstore/detail/dnkalbdehemhbelicgdnpjdmimnkiojd) or find the extension by name: Typescript Logging Developer Extension.
Once installed, the next time you open the developer console a new tab "Logging" will be available. If the application on the website you visit uses typescript-logging
it will contain the relevant logging options.

![Extension screenshot](img/typescript-logging-tab.png)


## Local testing (open file from disk)

When opening an application locally by direct file (e.g. using file:///home/user/someurl.html) you need to allow "url access" for the extension. This is only necessary if locally testing by a direct file (and not a normal URL).
If so:
* In the browser type: chrome://extensions
* Find the extension, and check "Allow access to file urls".

## History
* 0.2.0 (current release)
  * Compatible with typescript-logging 0.2.0-beta6 and newer.
* 0.1.0
  * Initial release compatible with typescript-logging 0.2.0-beta1 up to 0.2.0-beta5.
