/**
 * This reporter is adapted from the CLI reporter built into the pa11y library,
 * with some small differences for performance reasons.
 *
 * @see https://github.com/pa11y/pa11y/blob/6.1.1/lib/reporters/cli.js
 */
// @ts-check

'use strict'

const { cyan, green, gray, red, underline, yellow } = require('picocolors')

// Pa11y version support
const PA11Y_SUPPORTS = '^6.0.0 || ^6.0.0-alpha || ^6.0.0-beta'

const DUPLICATE_WHITESPACE_EXP = /\s+/g
const EMPTY_SPACE = ' '
const NEWLINE_LITERAL = '\n'

const rootFilePath = 'file://' + process.cwd()

// Helper strings for use in reporter methods
const start = cyan(' >')
const typeIndicators = {
	error: red(' • Error:'),
	notice: cyan(' • Notice:'),
	unknown: gray(' •'),
	warning: yellow(' • Warning:'),
}

function renderIssue(issue) {
	const code = issue.code
	const selector = issue.selector.replace(DUPLICATE_WHITESPACE_EXP, EMPTY_SPACE)
	const context = issue.context ? issue.context.replace(DUPLICATE_WHITESPACE_EXP, EMPTY_SPACE) : '[no context]'

	return cleanWhitespace(`

	${typeIndicators[issue.type]} ${issue.message}
		${gray(`├── ${code}`)}
		${gray(`├── ${selector}`)}
		${gray(`└── ${context}`)}
	`)
}

// Output formatted results
function renderResults(results) {
	const relativeFilePath = results.pageUrl.replace(rootFilePath, '.')
	if (results.issues.length) {
		const totals = {
			error: 0,
			notice: 0,
			warning: 0,
		}
		const issues = []
		const summary = []

		for (const issue of results.issues) {
			issues.push(renderIssue(issue))
			totals[issue.type] = totals[issue.type] + 1
		}

		if (totals.error > 0) {
			summary.push(red(`${totals.error} ${pluralize('Error', totals.error)}`))
		}
		if (totals.warning > 0) {
			summary.push(yellow(`${totals.warning} ${pluralize('Warning', totals.warning)}`))
		}
		if (totals.notice > 0) {
			summary.push(cyan(`${totals.notice} ${pluralize('Notice', totals.notice)}`))
		}

		return cleanWhitespace(`

			${underline(`Results for file: ${relativeFilePath}`)}
			${issues.join(NEWLINE_LITERAL)}

			${summary.join(NEWLINE_LITERAL)}

		`)
	}
	return cleanWhitespace(`
		${green('No issues found!')}
	`)
}

// Output the welcome message once Pa11y begins testing
function renderBegin() {
	return cleanWhitespace(`
		${cyan(underline('Welcome to Pa11y'))}
	`)
}

// Output debug messages
function renderDebug(message) {
	message = `Debug: ${message}`
	return cleanWhitespace(`
		${start} ${gray(message)}
	`)
}

// Output information messages
function renderInfo(message) {
	return cleanWhitespace(`
		${start} ${message}
	`)
}

function renderError(message) {
	if (!/^error:/i.test(message)) {
		message = `Error: ${message}`
	}
	return cleanWhitespace(`
		${red(message)}
	`)
}

// Clean whitespace from output. This function is used to keep
// the reporter code a little cleaner
function cleanWhitespace(string) {
	return string.replace(/\t+|^\t*\n|\n\t*$/g, '')
}

function pluralize(noun, count) {
	return count === 1 ? noun : noun + 's'
}

module.exports = {
	begin: renderBegin,
	debug: renderDebug,
	info: renderInfo,
	error: renderError,
	results: renderResults,
	supports: PA11Y_SUPPORTS,
}