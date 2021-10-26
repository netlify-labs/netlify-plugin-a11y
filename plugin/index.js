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
      absolutePublishDir,
      checkPaths,
      debugMode,
      ignoreDirectories,
      pa11yOpts,
      resultMode,
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
      const postRunMsg = `Pa11y found ${issueCount} accessibility issues with your site! Check the logs above for more information.`
      console.log(results);
      if (resultMode === 'error') {
        build.failBuild(postRunMsg)
      } else {
        console.warn(postRunMsg)
      }
    }

  } catch(err) {
    build.failBuild(err.message)
  }


  }
}
