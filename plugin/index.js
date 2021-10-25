// const {
//   cwd,
//   env: { SITE }
// } = require('process');

const chalk = require('chalk');
const path = require('path');
const pluginCore = require('./pluginCore');

module.exports = {
    async onPostBuild({
      inputs: { checkPaths, ignoreDirectories, resultMode, debugMode },
      utils: { build },
      netlifyConfig
    }) {
      const htmlFilePaths = await pluginCore.generateFilePaths({
        fileAndDirPaths: checkPaths,
        ignoreDirectories: ignoreDirectories || [],
        absolutePublishDir: netlifyConfig.build.publish
      });
      if (debugMode) {
        console.log({ htmlFilePaths });
      }
      const results = await pluginCore.runPa11y({
        htmlFilePaths,
        build,
        debugMode
      });

      if (results.length) {
        console.log(results);
      }
    }
}
