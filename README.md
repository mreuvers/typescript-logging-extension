# typescript-logging-extension

This project is a browser extension, currently for Chrome only, to add a logging tab to the developer console if [typescript-logging](https://github.com/mreuvers/typescript-logging) is used by the application.
The extension allows to easily change logging levels dynamically and (text) filtering. Your application should use [typescript-logging](https://github.com/mreuvers/typescript-logging) in order for the extension to be useful,
for details on that project visit the page.

## Installation

Start Chrome and visit the [Chrome web store](https://chrome.google.com/webstore/category/extensions) and find the extension by name: typescript-logging-extension.
Once installed, the next time you open the developer console a new tab "Logging" will be available. If the application on the website you visit uses typescript-logging
it will contain the relevant logging options.

![Image of Yaktocat](img/typescript-logging-tab.png)
