const fs = require('fs');
const path = require('path');

const parseArgs = require('./helpers/args');
const NameGen = require('./helpers/namegen');
const PromiseAllCounter = require('./helpers/promise-all');

const NAME_LEN = 4; // name length for mock files in mess directory

let settings = parseArgs({
  dep: 3, // default directories depth
  fill: 10, // default items quantity for each directory
  dir: '../mess' // default mess directory path
}, ['dir'], ['dep', 'fill']);

if (fs.existsSync(settings.dir)) {
  console.error('Librarian ERROR: path already exists: ', settings.dir);
  process.exit(3);
}

fs.mkdir(settings.dir, { recursive: true }, function () {
  fillDir(settings.dir, settings.fill, settings.dep, function () {
    console.log('Librarian: Mess generation completed. See: ', settings.dir);
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
  const pAll = new PromiseAllCounter(cb).setCallbacksCount(itemsCount);

  for (let i = 0; i < itemsCount; i++) {
    if (Math.random() > dirChance) { // create dir
      let dirName = path.join(dirPath, NameGen.generateName(NAME_LEN, i));
      fs.mkdir(dirName, { recursive: true }, function (error) {
        if (error) return;
        // fill directories recursively
        fillDir(dirName, itemsCount, remainingDepth, function () {
          pAll.complete(i);
        });
      });
    } else { // create file
      let fileName = path.join(dirPath, NameGen.generateFileName(NAME_LEN, i));
      fs.appendFile(fileName, '// test file ' + i, 'utf8', function (error) {
        if (error) return;
        pAll.complete(i);
      });
    }
  }
}
