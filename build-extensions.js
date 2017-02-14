const shell = require('shelljs');

const dirInput='src/extension/browser';
const dirOutput='dist/extension/browser';

// Chrome extension dirs
const dirOutputChrome = dirOutput + '/chrome';
const dirInputChrome = dirInput + '/chrome';

console.log('Building chrome extension...');

if(shell.test('-e', dirOutput)) {
  shell.rm('-r', dirOutput);
}
shell.mkdir('-p', dirOutputChrome);

// Yes dirOutput, chrome subdir will be created.
shell.cp('-R', dirInputChrome, dirOutput);

console.log("Extension built.");
