const fs = require('fs');
const path = require('path');

const Args = require('./helpers/args');
const NameGen = require('./helpers/namegen');

const NAME_LEN = 4;

let settings = Args.parse({
  dep: 3, // directories depth
  fill: 10, // items quantity for each directory
  dir: '../mess' // default mess directory path
}, ['dir'], ['dep', 'fill']);

if (fs.existsSync(settings.dir)) {
  console.error('Librarian ERROR: path already exists: ', settings.dir);
  process.exit(3);
}

fs.mkdir(settings.dir, { recursive: true }, function () {
  fillDir(settings.dir, settings.fill, settings.dep, function () {
    console.log('Librarian: Mess generation is complete. See: ', settings.dir);
  });
});

/**
 * Recursive function for mess generation. It uses Math.random() to define
 * whether to create a directory or a file when generating target directory content.
 * @param dirPath
 * @param itemsCount
 * @param remainingDepth
 * @param cb
 */
function fillDir (dirPath, itemsCount = 10, remainingDepth = 3, cb = () => {}) {
  remainingDepth -= 1;
  let dirChance = remainingDepth > 0 ? 0.8 : 1; // random chance to fill target directory by subdirectories
  let callbacksComplete = Array(itemsCount).fill(false); // array of flags indicating that we need to wait some callbacks

  for (let i = 0; i < itemsCount; i++) {
    if (Math.random() > dirChance) { // create dir
      let dirName = path.join(dirPath, NameGen.generateName(NAME_LEN, i));
      fs.mkdir(dirName, { recursive: true }, function (error) {
        if (error) return;
        // fill directories recursively
        fillDir(dirName, itemsCount, remainingDepth, function () {
          callBackControl(i);
        });
      });
    } else { // create file
      let fileName = path.join(dirPath, NameGen.generateFileName(NAME_LEN, i));
      fs.appendFile(fileName, '// test file ' + i, 'utf8', function (error) {
        if (error) return;
        callBackControl(i);
      });
    }
  }

  /**
   * Callback for each asynchronous function in general stack.
   * When last callback will be completed, stack will contain only 'true' values.
   * It will be the signal for completing whole stack.
   * @param index - Index of completed callback
   */
  function callBackControl (index) {
    callbacksComplete[index] = true; // this cb is complete
    // check other callbacks
    for (let m = 0; m < callbacksComplete.length; m++) {
      if (!callbacksComplete[m]) return; // there are still not completed callbacks
    }
    cb(); // all callbacks are completed, so can run main callback
  }
}
