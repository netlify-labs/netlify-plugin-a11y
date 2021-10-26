const AXE = 'axe';
const HTMLCS = 'htmlcs';
const INSTALLED_RUNNERS = [AXE, HTMLCS];

const DEFAULT_RUNNERS = [AXE];
const DEFAULT_CHECK_PATHS = ['/'];
const DEFAULT_RESULT_MODE = 'error';
const DEFAULT_IGNORE_DIRECTORIES = [];

const PA11Y_USER_AGENT = 'netlify-plugin-a11y';

const isInvalidRunner = runners => (
  (runners && !Array.isArray(runners) || !runners.every(val => INSTALLED_RUNNERS.includes(val)))
);

const getConfiguration = ({
  constants: { PUBLISH_DIR },
  inputs: { checkPaths, debugMode, ignoreDirectories, resultMode, runners }
}) => {

  runners = runners || DEFAULT_RUNNERS;

  if (isInvalidRunner(runners)) {
    throw new Error(`Invalid value for \`runners\` input. Runners must be ${AXE} or ${HTMLCS}`);
  }
  return {
    absolutePublishDir: PUBLISH_DIR || process.env.PUBLISH_DIR,
    checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
    debugMode: debugMode || false,
    ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
    pa11yOpts: {
      runners,
      resultMode: resultMode || DEFAULT_RESULT_MODE,
      userAgent: PA11Y_USER_AGENT,
    }
  }
}

module.exports = {
  getConfiguration
}