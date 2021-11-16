// @ts-check

const DEFAULT_CHECK_PATHS = ['/']
const DEFAULT_FAIL_WITH_ISSUES = true
const DEFAULT_IGNORE_DIRECTORIES = []

const PA11Y_DEFAULT_WCAG_LEVEL = 'WCAG2AA'
const PA11Y_RUNNERS = ['axe']
const PA11Y_USER_AGENT = 'netlify-plugin-a11y'

const getConfiguration = ({
	constants: { PUBLISH_DIR },
	inputs: { checkPaths, ignoreDirectories, failWithIssues, wcagLevel },
}) => {
	return {
		absolutePublishDir: PUBLISH_DIR || process.env.PUBLISH_DIR,
		checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
		ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
		failWithIssues: failWithIssues !== undefined ? failWithIssues : DEFAULT_FAIL_WITH_ISSUES,
		pa11yOpts: {
			runners: PA11Y_RUNNERS,
			userAgent: PA11Y_USER_AGENT,
			standard: wcagLevel || PA11Y_DEFAULT_WCAG_LEVEL,
		},
	}
}

module.exports = {
	getConfiguration,
}
