// @ts-check

const { getConfiguration } = require('./config')
const { generateFilePaths, runPa11y } = require('./pluginCore')
const pico = require('picocolors')

module.exports = {
	async onPostBuild({ constants, inputs, utils: { build } }) {
		try {
			const { publishDir, checkPaths, ignoreDirectories, wcagLevel, failWithIssues } = getConfiguration({
				constants,
				inputs,
			})
			const htmlFilePaths = await generateFilePaths({
				publishDir,
				ignoreDirectories,
				fileAndDirPaths: checkPaths,
			})

			const { report, issueCount } = await runPa11y({
				build,
				htmlFilePaths,
				publishDir,
				wcagLevel,
			})
			const reportSummary =
				`${issueCount === 0 ? 'No' : issueCount} accessibility issues found!` +
				(issueCount > 0 ? ' Check the logs for more information.' : '')

			console.log(report)

			if (failWithIssues) {
				build.failBuild(reportSummary)
			} else {
				console.warn(pico.magenta(reportSummary))
			}
		} catch (err) {
			build.failBuild(err.message)
		}
	},
}
