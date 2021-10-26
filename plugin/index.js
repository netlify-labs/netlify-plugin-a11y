// const {
//   cwd,
//   env: { SITE }
// } = require('process');


const { getConfiguration } = require('./config')
const pluginCore = require('./pluginCore');


module.exports = {
  async onPostBuild({
    constants,
    inputs,
    utils: { build },
  }) {

    try {
    const {
      checkPaths,
      debugMode,
      ignoreDirectories,
      pa11yOpts
    } = getConfiguration({ constants, inputs })
    const htmlFilePaths = await pluginCore.generateFilePaths({
      absolutePublishDir,
      fileAndDirPaths: checkPaths,
      ignoreDirectories: ignoreDirectories,
    });
    if (debugMode) {
      console.log({ htmlFilePaths });
    }

    const { results, issueCount } = await pluginCore.runPa11y({
      build,
      debugMode,
      htmlFilePaths,
      pa11yOpts,
    });
    if (issueCount > 0) {
      console.log(results);
      build.failBuild(`Pa11y found ${issueCount} accessibility issues with your site! Check the logs above for more information`);
    }

  } catch(err) {
    build.failBuild(err.message)
  }


  }
}
