const fs = require('fs');
const path = require('path');

const parseArgs = require('./helpers/args');
const PromiseAllCounter = require('./helpers/promise-all');

let settings = parseArgs({
  from: '../mess', // default mess directory path
  to: '../result', // default target result path
  delsrc: false // default flag to delete source directory
}, ['from', 'to']);

validateDirectories(settings.from, settings.to, function () {
  fs.mkdir(settings.to, {}, (err) => {
    if (err) {
      console.log('Librarian ERROR: Can\'t create directory ', settings.to);
      return;
    }
    moveDirectory(settings.from, settings.to, function (info) {
      if (settings.delsrc) {
        deleteSrc(info, () => {
          console.log(`Done! ${info.files.length} files sorted in ${settings.to}. Source directory deleted.`);
        });
        return;
      }
      console.log(`Done! ${info.files.length} files sorted in ${settings.to}.`);
    });
  });
});

function deleteSrc (infoObj, callback = () => {}) {
  if (!infoObj.files && !infoObj.dirs) {
    callback();
    return;
  }

  const pAllDelFiles = new PromiseAllCounter(() => { deleteDirs(infoObj.dirs, callback); }).setCallbacksCount(infoObj.files.length);
  for (let j = infoObj.files.length - 1; j >= 0; j--) {
    fs.unlink(infoObj.files[j], () => {
      pAllDelFiles.complete(j);
    });
  }

  function deleteDirs (dirs, callb = () => {}) {
    const pAllDelDirs = new PromiseAllCounter(callb).setCallbacksCount(dirs.length);
    console.log(dirs);
    for (let l = dirs.length - 1; l >= 0; l--) {
      fs.rmdir(dirs[l], (err) => {
        if (err) console.log(err);
        else console.log(`DELETED: ${dirs[l]}`);
        pAllDelDirs.complete(l);
      });
    }
  }
}

function moveDirectory (srcDirPath, targDirPath, cb = () => {}) {
  const initObj = { files: [], dirs: [], dirLetters: [] };
  if (!srcDirPath || !targDirPath) {
    cb(initObj);
    return;
  }

  collectDirInfo(srcDirPath, initObj, function (infoO) {
    makeTargetSubDirs(targDirPath, infoO.dirLetters, function () {
      copyFiles(targDirPath, infoO.files, function () {
        cb(infoO);
      });
    });
  });

  function copyFiles (targetDir, files = [], cbCopy = () => {}) {
    if (!targetDir) {
      cbCopy();
      return;
    }
    const pAllCopy = new PromiseAllCounter(cbCopy, files).setCallbacksCount(files.length);
    for (let i = 0; i < files.length; i++) {
      let base = path.basename(files[i]);
      let firstLet = base.substring(0, 1).toLowerCase();
      fs.copyFile(files[i], path.join(targetDir, firstLet, base), function () {
        pAllCopy.complete(i);
      });
    }
  }

  function collectDirInfo (srcDir, infoObj = { files: [], dirs: [], dirLetters: [] }, cbDirInfo = () => {}) {
    if (!srcDir) {
      cbDirInfo(infoObj);
      return;
    }
    const pAllDirInfo = new PromiseAllCounter(cbDirInfo, infoObj);
    infoObj.dirs.push(srcDir);

    fs.readdir(srcDir, 'utf8', function (err, files) {
      pAllDirInfo.setCallbacksCount(files.length);

      for (let i = 0; i < files.length; i++) {
        fs.stat(path.join(srcDir, files[i]), {}, function (err, stats) {
          if (stats.isFile()) { // move file
            let firstLetter = files[i].substring(0, 1).toLowerCase();
            if (infoObj.dirLetters.indexOf(firstLetter) < 0) infoObj.dirLetters.push(firstLetter);
            infoObj.files.push(path.join(srcDir, files[i]));
            pAllDirInfo.complete(i);
          } else if (stats.isDirectory()) { // dig into directory recursively
            collectDirInfo(path.join(srcDir, files[i]), infoObj, function () {
              pAllDirInfo.complete(i);
            });
          }
        });
      }
    });
  }

  function makeTargetSubDirs (targetDir, namesArr = [], cbTargetDirs = () => {}) {
    if (namesArr.length === 0) {
      cbTargetDirs();
      return;
    }
    const pAllDir = new PromiseAllCounter(cbTargetDirs, namesArr).setCallbacksCount(namesArr.length);
    for (let k = 0; k < namesArr.length; k++) {
      fs.mkdir(path.join(targetDir, namesArr[k]), {}, function () {
        pAllDir.complete(k);
      });
    }
  }
}

/**
 * Asynchronous paths validation and restrictions:
 * 'from' !== 'to' (we will not handle the case with creating temporary directory)
 * 'from' is exists and it is readable and writable directory
 * if 'to' is exists it must be readable and writable directory
 * @param from Path to source directory
 * @param to Path to target directory
 * @param cb callback
 */
function validateDirectories (from, to, cb) {
  let cbCount = 2; // for this case set asynchronous callbacks count manually.
  // Script will decrease counter on each callback completion.
  let pAll = new PromiseAllCounter(cb).setCallbacksCount(cbCount);
  if (path.relative(__dirname, from) === path.relative(__dirname, to)) {
    console.error('Librarian ERROR: Source and target directory can\'t be the same.');
    process.exit(2);
  }
  fs.access(from, fs.constants.F_OK | fs.constants.W_OK, function (err) {
    if (err) {
      console.error(`Librarian ERROR: ${from} is unreachable.`);
      process.exit(1);
    }
    fs.stat(from, {}, (err, stats) => {
      if (stats.isDirectory()) {
        pAll.complete(--cbCount);
        return;
      }
      console.error(`Librarian ERROR: ${from} - is not directory.`);
      process.exit(2);
    });
  });

  fs.access(to, fs.constants.F_OK, function (err) {
    if (!err) {
      console.error('Librarian ERROR: There target path already exists: ', to, ' \n Please, set another target name.');
      process.exit(3);
    }
    pAll.complete(--cbCount);
  });
}
