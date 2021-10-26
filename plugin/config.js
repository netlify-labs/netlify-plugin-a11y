const AXE = 'axe';
const HTMLCS = 'htmlcs';
const INSTALLED_RUNNERS = [AXE, HTMLCS];

const DEFAULT_RUNNERS = [AXE];
const DEFAULT_STANDARD = 'WCAG2AA';
const DEFAULT_CHECK_PATHS = ['/'];
const DEFAULT_FAIL_WITH_ISSUES = true;
const DEFAULT_IGNORE_DIRECTORIES = [];

const PA11Y_USER_AGENT = 'netlify-plugin-a11y';

const isInvalidRunner = runners => (
  (runners && !Array.isArray(runners) || !runners.every(val => INSTALLED_RUNNERS.includes(val)))
);

const getConfiguration = ({
  constants: { PUBLISH_DIR },
  inputs: { checkPaths, debugMode, ignoreDirectories, failWithIssues, runners, standard }
}) => {

  runners = runners || DEFAULT_RUNNERS;

  if (isInvalidRunner(runners)) {
    throw new Error(`Invalid value for \`runners\` input. Runners must be \`${AXE}\` or \`${HTMLCS}\`.`);
  }
  return {
    absolutePublishDir: PUBLISH_DIR || process.env.PUBLISH_DIR,
    checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
    debugMode: debugMode || false,
    ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
    failWithIssues: failWithIssues !== undefined ? failWithIssues : DEFAULT_FAIL_WITH_ISSUES,
    pa11yOpts: {
      runners,
      userAgent: PA11Y_USER_AGENT,
      standard: standard || DEFAULT_STANDARD,
    }
  }
}

module.exports = {
  getConfiguration
}