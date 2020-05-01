// const {
//   cwd,
//   env: { SITE }
// } = require('process');

const chalk = require('chalk');
const makeDir = require('make-dir');
const pa11y = require('pa11y');
const path = require('path');
const pluginCore = require('./pluginCore');

function netlifyPlugin(conf) {
  return {
    name: 'netlify-plugin-a11y',
    async onPostBuild({
      pluginConfig: { checkPaths, resultMode = 'error', debugMode },
      constants: { PUBLISH_DIR },
      utils: { build }
    }) {
      const htmlFilePaths = await pluginCore.generateFilePaths({
        fileAndDirPaths: checkPaths,
        PUBLISH_DIR
      });
      if (debugMode) {
        console.log({ htmlFilePaths });
      }
      const results = await pluginCore.runPa11y({
        htmlFilePaths,
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
  };
}

module.exports = netlifyPlugin;
