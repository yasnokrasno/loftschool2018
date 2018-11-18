const path = require('path');

/**
 * Use native argv instead of https://www.npmjs.com/minimist for learning purposes.
 * This function is preparing arguments:
 * 1) connect argument names and values
 * 2) prepare paths and integers for further usage
 * @param settings Default settings
 * @param pathArgs Array of arguments names, that are containing paths
 * @param intArgs Array of arguments names, that are containing integers
 * @returns {*}
 */
function parseArgs (settings, pathArgs = [], intArgs = []) {
  /**
   * Read CLI arguments and rewrite default settings.
   */
  const cliArgs = process.argv.slice(2);

  for (let i = 0; i < cliArgs.length; i++) {
    if (cliArgs[i].substr(0, 1) !== '-') continue; // arguments names must be prefixed by '-' or '--'
    let isFlag = false;
    if (cliArgs[i].substr(0, 2) === '--') isFlag = true; // flags are prefixed by '--'
    const argName = isFlag ? cliArgs[i].slice(2) : cliArgs[i].slice(1);
    if (isFlag && settings[argName] === false) {
      settings[argName] = true;
      continue;
    }
    if (!isFlag && settings[argName]) {
      let nextItem = cliArgs[i + 1];
      if (nextItem && nextItem.substr(0, 1) !== '-') {
        settings[argName] = nextItem;
      }
    }
  }
  // prepare integers
  if (intArgs.length > 0) {
    for (let n = 0; n < intArgs.length; n++) {
      if (settings[intArgs[n]]) {
        settings[intArgs[n]] = +settings[intArgs[n]];
      }
    }
  }
  // prepare paths
  if (pathArgs.length > 0) {
    for (let n = 0; n < pathArgs.length; n++) {
      if (settings[pathArgs[n]]) {
        settings[pathArgs[n]] = path.resolve(settings[pathArgs[n]]);
      }
    }
  }
  return settings;
}

module.exports = parseArgs;
