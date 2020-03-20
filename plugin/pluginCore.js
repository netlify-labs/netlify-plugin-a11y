const pa11y = require('pa11y');
const path = require('path');
const fs = require('fs');

const { promisify } = require('util');
const readDir = promisify(fs.readdir);

exports.runPa11y = async function({ htmlFilePaths, testMode, debugMode }) {
  const results = await Promise.all(htmlFilePaths.map(pa11y));
  return results;
};

exports.generateFilePaths = async function({
  fileAndDirPaths, // array, mix of html and directories
  BUILD_DIR,
  testMode,
  debugMode
}) {
  let htmlFilePaths = [];
  for (fileAndDirPath of fileAndDirPaths) {
    if (fs.statSync(path.join(BUILD_DIR, fileAndDirPath)).isDirectory()) {
      let subPaths = await walk(path.join(BUILD_DIR, fileAndDirPath));
      htmlFilePaths = htmlFilePaths.concat(subPaths);
    } else {
      htmlFilePaths.push(path.join(BUILD_DIR, fileAndDirPath));
    }
  }
  return htmlFilePaths;
};

var walk = async function(dir, filelist) {
  var files = await readDir(dir);
  filelist = filelist || [];
  await Promise.all(
    files.map(async function(file) {
      const dirfile = path.join(dir, file);
      if (fs.statSync(dirfile).isDirectory()) {
        filelist = await walk(dirfile + '/', filelist);
      } else {
        if (dirfile.endsWith('.html')) filelist.push(dirfile);
      }
    })
  );
  return filelist;
};

//  res:
//    [ { code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
//        type: 'error',
//        typeCode: 1,
//        message:
//         'Img element missing an alt attribute. Use the alt attribute to specify a short text alternative.',
//        context: '<img src="https://placekitten.com/200/300">',
//        selector: 'html > body > img',
//        runner: 'htmlcs',
//        runnerExtras: {} } ] }
