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
	inputs: { checkPaths, ignoreDirectories, ignoreElements, failWithIssues, wcagLevel },
}) => {
	return {
		checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
		failWithIssues: failWithIssues !== undefined ? failWithIssues : DEFAULT_FAIL_WITH_ISSUES,
		ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
		pa11yOpts: await getPa11yOpts({ hideElements: ignoreElements, standard: wcagLevel || PA11Y_DEFAULT_WCAG_LEVEL }),
		publishDir: PUBLISH_DIR || process.env.PUBLISH_DIR,
	}
}

/**
 * Generates the options object used to configure Pa11y.
 * @param {Object} pa11yInputs
 * @param {String} [pa11yInputs.hideElements]
 * @param {'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA'} pa11yInputs.standard
 * @returns
 */
const getPa11yOpts = async ({ hideElements, standard }) => {
	return {
		browser: await puppeteer.launch({ ignoreHTTPSErrors: true }),
		hideElements,
		runners: PA11Y_RUNNERS,
		userAgent: PA11Y_USER_AGENT,
		standard,
	}
}

module.exports = {
	getConfiguration,
}
