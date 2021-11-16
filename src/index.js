// @ts-check

const { getConfiguration } = require('./config')
const pluginCore = require('./pluginCore')
const pico = require('picocolors')

module.exports = {
	async onPostBuild({ constants, inputs, utils: { build } }) {
		try {
			const { absolutePublishDir, checkPaths, ignoreDirectories, pa11yOpts, failWithIssues } = getConfiguration({
				constants,
				inputs,
			})
			const htmlFilePaths = await pluginCore.generateFilePaths({
				absolutePublishDir,
				ignoreDirectories,
				fileAndDirPaths: checkPaths,
			})

			const { report, issueCount } = await pluginCore.runPa11y({
				build,
				htmlFilePaths,
				pa11yOpts,
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
