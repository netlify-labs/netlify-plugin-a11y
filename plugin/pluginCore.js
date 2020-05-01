const pa11y = require('pa11y');
const path = require('path');
const fs = require('fs');

const { promisify } = require('util');
const readDir = promisify(fs.readdir);

exports.runPa11y = async function({ htmlFilePaths, testMode, debugMode }) {
  let results = await Promise.all(htmlFilePaths.map(pa11y));
  results = results
    .filter((res) => res.issues.length)
    .map((res) =>
      res.issues.map((issue) => ({
        ...issue,
        documentTitle: res.documentTitle,
        pageUrl: res.pageUrl.slice(7)
      }))
    );
  let flattenedResults = [];
  results.forEach(
    (res) => void (flattenedResults = flattenedResults.concat(res))
  );
  if (debugMode) {
    console.log({ flattenedResults, results });
  }
  return flattenedResults;
};

exports.generateFilePaths = async function({
  fileAndDirPaths, // array, mix of html and directories
  PUBLISH_DIR,
  testMode,
  debugMode
}) {
  let htmlFilePaths = [];
  for (fileAndDirPath of fileAndDirPaths) {
    const fullDirPath = path.join(PUBLISH_DIR, fileAndDirPath);
    if (fs.statSync(fullDirPath).isDirectory()) {
      let subPaths = await walk(fullDirPath);
      htmlFilePaths = htmlFilePaths.concat(subPaths);
    } else {
      htmlFilePaths.push(fullDirPath);
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
