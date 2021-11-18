// @ts-check
const puppeteer = require('puppeteer')

const DEFAULT_CHECK_PATHS = ['/']
const DEFAULT_FAIL_WITH_ISSUES = true
const DEFAULT_IGNORE_DIRECTORIES = []

const PA11Y_DEFAULT_WCAG_LEVEL = 'WCAG2AA'
const PA11Y_RUNNERS = ['axe']
const PA11Y_USER_AGENT = 'netlify-plugin-a11y'

const getConfiguration = async ({
	constants: { PUBLISH_DIR },
	inputs: { checkPaths, ignoreDirectories, failWithIssues, wcagLevel },
}) => {
	const browser = await puppeteer.launch({
		// NB: iframes won't load in HTML files read directly from the filesystem
		args: ['--disable-web-security'],
		ignoreHTTPSErrors: true,
	})

	return {
		publishDir: PUBLISH_DIR || process.env.PUBLISH_DIR,
		checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
		ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
		failWithIssues: failWithIssues !== undefined ? failWithIssues : DEFAULT_FAIL_WITH_ISSUES,
		pa11yOpts: {
			browser,
			runners: PA11Y_RUNNERS,
			userAgent: PA11Y_USER_AGENT,
			standard: wcagLevel || PA11Y_DEFAULT_WCAG_LEVEL,
		},
	}
}

module.exports = {
	getConfiguration,
}
