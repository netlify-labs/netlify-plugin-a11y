// const {
//   cwd,
//   env: { SITE }
// } = require('process');

const chalk = require('chalk');
const path = require('path');
const pluginCore = require('./pluginCore');

module.exports = {
    async onPostBuild({
      inputs: { checkPaths, ignoreDirectories, resultMode, debugMode, runners },
      utils: { build },
      netlifyConfig
    }) {
      const pa11yOpts = {
        includeWarnings: resultMode === 'warn',
        runners: runners || ['axe']
      }

      const htmlFilePaths = await pluginCore.generateFilePaths({
        fileAndDirPaths: checkPaths,
        ignoreDirectories: ignoreDirectories || [],
        absolutePublishDir: netlifyConfig.build.publish
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

    }
}
