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
      
      try {
        const results = await pluginCore.runPa11y({
          htmlFilePaths,
          pa11yOpts,
          debugMode
        });
        if (results.length) {
          console.log(results);
        }
      } catch(error) {
        build.failBuild('pa11y failed', { error })
      }

    }
}
