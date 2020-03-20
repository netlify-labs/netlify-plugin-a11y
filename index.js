const {
  cwd,
  env: { SITE }
} = require('process');

const execa = require('execa');
const makeDir = require('make-dir');

function netlifyPlugin(conf) {
  return {
    name: 'netlify-plugin-axe',
    async onPostBuild({
      pluginConfig: { site, axeFlags },
      constants: { CACHE_DIR },
      utils: { run }
    }) {
      const resultsDir = `${CACHE_DIR}/axe-results`;
      await makeDir(resultsDir);

      const resultsPath = `${resultsDir}/result.json`
        .replace(cwd(), '')
        .replace(/^\//, '');

      const chromePath = path.join(
        __dirname,
        'node_modules/lib/chromedriver/chromedriver_mac64.zip'
      );

      await run.command(
        // `./node_modules/.bin/axe ${site} ${axeFlags} --save ${resultsPath}`
        `axe ${site} ${axeFlags} --chromedriver-path="${chromePath}" --save ${resultsPath}`
      );

      let results = require(resultsPath);
      if (results && results[0]) {
        results = results[0].violations;
      }
      console.log({ violations: results, len: results.length });
    }
  };
}

module.exports = netlifyPlugin;
