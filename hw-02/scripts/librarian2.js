const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');

const rawArgs = parseArgs(process.argv.slice(2));
const settings = Object.assign({
  from: '../mess', // default mess directory path
  to: '../result', // default target result path
  delsrc: false, // default flag to delete source directory
}, rawArgs);
settings.from = path.resolve(settings.from);
settings.to = path.resolve(settings.to);

librarian2(settings.from, settings.to, settings.delsrc).then(function (info) {
  console.log(`Librarian2: Done! ${info.files.length} files sorted in ${settings.to}.`);
});

/**
 * Main async function
 * @param srcDirPath
 * @param targetDirPath
 * @param delSrc
 * @returns {Promise<*>}
 */
async function librarian2 (srcDirPath, targetDirPath, delSrc = false) {
  const argumentsAreValid = await validateDirectories(srcDirPath, targetDirPath);
  if (!argumentsAreValid) {
    console.log('Librarian ERROR: Can\'t validate arguments.');
    process.exit(4);
  }

  const targetDirError = await new Promise(function (resolve) {
    fs.mkdir(settings.to, {}, (err) => resolve(err));
  });

  if (targetDirError) {
    console.log('Librarian ERROR: Can\'t create directory ', settings.to);
    return;
  }

  const info = await copyFilesFromMessToTargetDirectory(settings.from, settings.to);
  if (settings.delsrc) await deleteSrc(info);

  return info;
}

/**
 * Copy files from mess directory to corresponding subdirectories of target directory
 * @param srcDirPath
 * @param targetDirPath
 * @returns {Promise<*>}
 */
async function copyFilesFromMessToTargetDirectory (srcDirPath, targetDirPath) {
  if (!srcDirPath || !targetDirPath) {
    return;
  }
  const infoObj = await collectDirectoryPaths(srcDirPath);
  await makeTargetSubDirs(targetDirPath, infoObj.dirLetters);
  await copyFiles(targetDirPath, infoObj.files);
  return infoObj;
}

function copyFiles (targetDir, files = []) {
  if (!targetDir) {
    return Promise.resolve([]);
  }
  let promisesArr = Array(files.length);

  for (let i = 0; i < files.length; i++) {
    let base = path.basename(files[i]);
    let firstLet = base.substring(0, 1).toLowerCase();
    promisesArr.push(new Promise(function (resolve) {
      fs.copyFile(files[i], path.join(targetDir, firstLet, base), function () {
        resolve();
      });
    }));
  }
  return Promise.all(promisesArr);
}

function makeTargetSubDirs (targetDir, namesArr = []) {
  if (namesArr.length === 0) {
    return Promise.resolve([]);
  }
  let promisesArr = Array(namesArr.length);
  for (let k = 0; k < namesArr.length; k++) {
    promisesArr.push(new Promise(function (resolve) {
      fs.mkdir(path.join(targetDir, namesArr[k]), {}, function () {
        resolve();
      });
    }));
  }
  return Promise.all(promisesArr);
}

async function collectDirectoryPaths (srcDir, infoObj = { files: [], dirs: [], dirLetters: [] }) {
  if (!srcDir) return infoObj;

  infoObj.dirs.push(srcDir);

  let files = await new Promise(function (resolve) {
    fs.readdir(srcDir, 'utf8', function (err, files) {
      if (err) {
        resolve([]);
      } else {
        resolve(files);
      }
    });
  });

  let promisesArr = Array(files.length);

  for (let i = 0; i < files.length; i++) {
    promisesArr.push(new Promise(function (resolve) {
      fs.stat(path.join(srcDir, files[i]), {}, function (err, stats) {
        if (err) {
          resolve();
          return;
        }
        if (stats.isFile()) { // move file
          let firstLetter = files[i].substring(0, 1).toLowerCase();
          if (infoObj.dirLetters.indexOf(firstLetter) < 0) infoObj.dirLetters.push(firstLetter);
          infoObj.files.push(path.join(srcDir, files[i]));
          resolve();
        } else if (stats.isDirectory()) { // dig into directory recursively
          collectDirectoryPaths(path.join(srcDir, files[i]), infoObj).then(function () {
            resolve();
          });
        }
      });
    }));
  }

  await Promise.all(promisesArr);
  return infoObj;
}

async function deleteSrc (infoObj) {
  if (!infoObj.files && !infoObj.dirs) {
    return Promise.resolve(infoObj);
  }
  let filePromises = Array(infoObj.files.length);

  // files are not blocking each other, so we can use parallel Promises via Promise.all method
  // to delete array of files by direct absolute paths
  for (let i = infoObj.files.length - 1; i >= 0; i--) {
    filePromises.push(new Promise(function (resolve) {
      fs.unlink(infoObj.files[i], (err) => resolve(err));
    }));
  }
  await Promise.all(filePromises);

  // directory is blocked for deletion if it has children,
  // so directory must be empty before calling rmDir on it and we can't use parallel Promises with Promise.all()
  // infoObj.dirs is sorted from most upper directory at the beginning to deepest nested directory at the end of array,
  // so we can iterate through it in reverse order and delete all directories without errors.
  for (let k = infoObj.dirs.length - 1; k >= 0; k--) {
    await new Promise(function (resolve) {
      fs.rmdir(infoObj.dirs[k], (err) => resolve(err));
    });
  }
  console.log(`Librarian2: Source files are deleted.`);
}

/**
 * Asynchronous paths validation and restrictions:
 * 'from' !== 'to' (we will not handle the case with creating temporary directory)
 * 'from' is exists and it is readable and writable directory
 * if 'to' is exists it must be readable and writable directory
 * @param from Path to source directory
 * @param to Path to target directory
 */
async function validateDirectories (from, to) {
  if (path.relative(__dirname, from) === path.relative(__dirname, to)) {
    console.error('Librarian2 ERROR: Source and target directory can\'t be the same.');
    process.exit(2);
  }
  await new Promise(function (resolve) {
    fs.access(from, fs.constants.F_OK | fs.constants.W_OK, function (err) {
      if (err) {
        console.error(`Librarian2 ERROR: ${from} is unreachable.`);
        process.exit(1);
      } else {
        resolve(true);
      }
    });
  });

  await new Promise(function (resolve) {
    fs.stat(from, {}, (err, stats) => {
      if (err || !stats.isDirectory()) {
        console.error(`Librarian2 ERROR: ${from} - is not directory.`);
        process.exit(2);
      }
      resolve();
    });
  });

  await new Promise(function (resolve) {
    fs.access(to, fs.constants.F_OK, function (err) {
      if (!err) {
        console.error('Librarian2 ERROR: Target path already exists: ', to, ' \n Please, set another target name.');
        process.exit(3);
      }
      resolve();
    });
  });

  return true;
}
