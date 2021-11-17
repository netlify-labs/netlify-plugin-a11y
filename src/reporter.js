// @ts-check
'use strict'

const { cyan, green, gray, red, underline, yellow } = require('picocolors')

const DUPLICATE_WHITESPACE_EXP = /\s+/g
const EMPTY_SPACE = ' '
const NEWLINE_LITERAL = '\n'

const rootFilePath = 'file://' + process.cwd()

// Helper strings for use in reporter methods
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

// Clean whitespace from output. This function is used to keep
// the reporter code a little cleaner
function cleanWhitespace(string) {
	return string.replace(/\t+|^\t*\n|\n\t*$/g, '')
}

function pluralize(noun, count) {
	return count === 1 ? noun : noun + 's'
}

const reporter = {}

// Pa11y version support
reporter.supports = '^6.0.0 || ^6.0.0-alpha || ^6.0.0-beta'

reporter.results = renderResults

module.exports = reporter
