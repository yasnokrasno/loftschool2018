const path = require('path');
const fs = require('fs');
/**
 * Use native argv instead of https://www.npmjs.com/minimist for learning purposes.
 */
module.exports = {
  /**
   * This function is preparing arguments for main script:
   * 1) connect argument names and values
   * 2) prepare paths for further usage
   * @param settings Default settings
   * @param pathArgs Array of arguments names, that are containing paths
   * @param intArgs Array of arguments names, that are containing integers
   * @returns {*}
   */
  parse: function (settings, pathArgs = [], intArgs = []) {
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
          if (pathArgs.indexOf(argName) > -1) { // if this argument is marked as Path - prepare path
            nextItem = path.resolve(nextItem);
          }
          if (intArgs.indexOf(argName) > -1) { // if this argument is marked as Integer - prepare path
            nextItem = +nextItem;
          }
          settings[argName] = nextItem;
        }
      }
    }
    return settings;
  },
  /**
   * Asynchronous paths validation and restrictions:
   * 'from' !== 'to' (we will not handle the case with creating temporary directory)
   * 'from' is exists and it is readable and writable directory
   * if 'to' is exists it must be readable and writable directory
   * @param from Path to source directory
   * @param to Path to target directory
   * @param cb callback
   */
  validate: function (from, to, cb) {
    if (!fs.existsSync(from)) {
      console.error('Librarian ERROR: There is no such directory: ', from);
      process.exit(1);
    }
    if (path.relative(__dirname, from) === path.relative(__dirname, to)) {
      console.error('Librarian ERROR: Source and target directory can\'t be the same.');
      process.exit(2);
    }

    fs.stat(from, {}, (err, stats) => {
      console.log(stats);
      cb();
    });
  }
};
