const pa11y = require('pa11y');
const { extname } = require('path')
const { isDirectory, isFile } = require('path-type')
const { results: cliReporter } = require('pa11y/lib/reporters/cli');
const readdirp = require('readdirp')

const EMPTY_ARRAY = []

exports.runPa11y = async function({ htmlFilePaths, pa11yOpts }) {
  let results = await Promise.all(htmlFilePaths.flatMap(async path => {
    try {
      const res = await pa11y(path, pa11yOpts);
      return res.issues.length > 0 ? cliReporter(res) : EMPTY_ARRAY
    } catch(error) {
      build.failBuild('pa11y failed', { error })
    }
  }));
  
  return results.join('');
};

exports.generateFilePaths = async function({
  fileAndDirPaths, // array, mix of html and directories
  ignoreDirectories = [],
  absolutePublishDir,
  testMode,
  debugMode
}) {
  const excludeDirGlobs = ignoreDirectories.map(
    // add ! and strip leading slash
    (dir) => `!${dir.replace(/^\/+/, "")}`
  );
  const htmlFilePaths = await Promise.all(
    fileAndDirPaths.map(fileAndDirPath =>
      findHtmlFiles(`${absolutePublishDir}${fileAndDirPath}`, excludeDirGlobs)
    )
  )
  return [].concat(...htmlFilePaths)
};

const findHtmlFiles = async function (fileAndDirPath, directoryFilter) {
  if (await isDirectory(fileAndDirPath)) {
    const fileInfos = await readdirp.promise(fileAndDirPath, {
      fileFilter: '*.html',
      directoryFilter: !!directoryFilter.length ? directoryFilter : '*'
    })
    return fileInfos.map(({ fullPath }) => fullPath)
  }

  if (!(await isFile(fileAndDirPath))) {
    console.warn(`Folder ${fileAndDirPath} was provided in "checkPaths", but does not exist - it either indicates something went wrong with your build, or you can simply delete this folder from your "checkPaths" in netlify.toml`)
    return []
  }

  if (extname(fileAndDirPath) !== '.html') {
    return []
  }

  return [fileAndDirPath]
}

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
