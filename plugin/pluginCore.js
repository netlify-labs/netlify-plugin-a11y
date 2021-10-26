const pa11y = require('pa11y');
const { extname } = require('path')
const { isDirectory, isFile } = require('path-type')
const { results: cliReporter } = require('pa11y/lib/reporters/cli');
const readdirp = require('readdirp')

exports.runPa11y = async function ({ htmlFilePaths, pa11yOpts = {}, build }) {
  let issueCount = 0;
  const results = await Promise.all(htmlFilePaths.map(async path => {
    try {
      const res = await pa11y(path, pa11yOpts);
      if (res.issues && res.issues.length) {
        issueCount += res.issues.length;
        return cliReporter(res)
      }
    } catch (error) {
      build.failBuild('pa11y failed', { error })
    }
  }))

  return {
    issueCount,
    results: results.filter(Boolean)
      .join(''),
  };
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