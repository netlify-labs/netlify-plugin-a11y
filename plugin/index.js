// const {
//   cwd,
//   env: { SITE }
// } = require('process');

const chalk = require('chalk');
const makeDir = require('make-dir');
const pa11y = require('pa11y');
const pluginCore = require('./pluginCore');

function netlifyPlugin(conf) {
  return {
    name: 'netlify-plugin-a11y',
    async onPostBuild({
      pluginConfig: { checkPaths, resultMode = 'error', debugMode },
      constants: { PUBLISH_DIR },
      utils: { build }
    }) {
      if (!checkPaths) {
        throw new Error(
          `checkPaths is undefined - please specify some checkPaths`
        );
      }
      const htmlFilePaths = await pluginCore.generateFilePaths({
        fileAndDirPaths: checkPaths,
        PUBLISH_DIR
      });
      if (debugMode) {
        console.log({ htmlFilePaths });
      }
      const results = await pluginCore.runPa11y({
        htmlFilePaths
      });

      if (results.length) {
        if (debugMode) {
          console.log({ results });
        }
        if (resultMode === 'error') {
          results.forEach((res) => {
            console.error(
              `${chalk.red(res.type)} ${chalk.blue(res.typeCode)}: ${
                res.message
              } (${chalk.blue(res.context)})`
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
              `${chalk.red(res.type)} ${chalk.blue(res.typeCode)}: ${
                res.message
              } (${chalk.blue(res.context)})`
            );
          });
          console.warn(
            chalk.red(
              `${results.length} accessibility issues found! Check the warnings.`
            )
          );
        }
      }
    }
  };
}

module.exports = netlifyPlugin;
