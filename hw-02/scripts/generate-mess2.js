const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');

const nameGen = require('../../hw-01/scripts/helpers/namegen');

const NAME_LEN = 5; // name length for mock files in mess directory

const rawArgs = parseArgs(process.argv.slice(2));
const settings = Object.assign({
  dep: 3, // default directories depth
  fill: 10, // default items quantity for each directory
  dir: '../mess', // default mess directory path
}, rawArgs);
settings.dir = path.resolve(settings.dir);

if (fs.existsSync(settings.dir)) {
  console.error('Librarian2 ERROR: path already exists: ', settings.dir);
  process.exit(3);
}

fs.mkdir(settings.dir, { recursive: true }, function () {
  generateDirectory(settings.dir, settings.fill, settings.dep).then(function () {
    console.log('Librarian2: Mess generation completed. See: ', settings.dir);
  });
});

/**
 * Recursive function for mess generation. It uses Math.random() to define
 * whether to create a directory or a file when generating target directory content.
 * @param dirPath
 * @param itemsCount
 * @param remainingDepth - need to handle recursion depth
 */
function generateDirectory (dirPath, itemsCount = 10, remainingDepth = 3) {
  let dirCreationChance = remainingDepth > 1 ? 0.8 : 1; // random chance to fill target directory by subdirectories
  remainingDepth -= 1;
  const promisesArr = Array(itemsCount);

  for (let i = 0; i < itemsCount; i++) {
    const willMakeDir = Math.random() > dirCreationChance;
    const makeItemFunc = willMakeDir ? makeDir : makeFile;
    promisesArr.push(new Promise(function (resolve) {
      makeItemFunc(dirPath).then(function (createdItemPath) {
        if (!createdItemPath) resolve(false);
        if (willMakeDir) {
          generateDirectory(createdItemPath, itemsCount, remainingDepth).then(function (result) {
            resolve(result);
          }, () => {
            resolve(false);
          });
        } else {
          resolve(createdItemPath);
        }
      }, () => {
        resolve(false);
      });
    }));
  }
  return Promise.all(promisesArr);
}

/**
 * Create one mock file in given directory path.
 * @param targetDirPath
 * @returns {Promise<any>}
 */
function makeFile (targetDirPath) {
  return new Promise(function (resolve) {
    let filePath = path.join(targetDirPath, nameGen.generateFileName(NAME_LEN));
    fs.appendFile(filePath, '// test file!!!', 'utf8', function (error) {
      if (error) resolve(false);
      resolve(filePath);
    });
  });
}

/**
 * Create one empty directory in given target directory.
 * @param targetDirPath
 * @returns {Promise<any>}
 */
function makeDir (targetDirPath) {
  return new Promise(function (resolve) {
    let dirPath = path.join(targetDirPath, nameGen.generateName(NAME_LEN));
    fs.mkdir(dirPath, { recursive: true }, function (error) {
      if (error) resolve(false);
      resolve(dirPath);
    });
  });
}
