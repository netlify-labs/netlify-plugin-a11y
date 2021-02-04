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
        if (debugMode) {
          console.log({ results });
          // console.log(results);
        }
        if (resultMode === 'error') {
          results.forEach((res) => {
            console.error(
              `[${chalk.cyan.bold(res.documentTitle)} (${path.relative(
                process.cwd(),
                res.pageUrl
              )})] ${chalk.magenta(res.type)} ${chalk.cyan(res.typeCode)}: ${
                res.message
              } (${chalk.cyan(res.context)})`
            );
          });
          build.failBuild(
            `${chalk.yellow(
              results.length
            )} accessibility issues found! Please fix.`
          );
        } else {
          results.forEach((res) => {
            console.warn(
              `[${chalk.cyan.bold(res.documentTitle)} (${path.relative(
                process.cwd(),
                res.pageUrl
              )})] ${chalk.magenta(res.type)} ${chalk.cyan(res.typeCode)}: ${
                res.message
              } (${chalk.cyan(res.context)})`
            );
          });
          console.warn(
            chalk.magenta(
              `${results.length} accessibility issues found! Check the warnings.`
            )
          );
        }
      }
    }
}
