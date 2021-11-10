// @ts-check

const { getConfiguration } = require('./config')
const pluginCore = require('./pluginCore')
const pico = require('picocolors')

module.exports = {
	async onPostBuild({ constants, inputs, utils: { build } }) {
		try {
			const { absolutePublishDir, checkPaths, debugMode, ignoreDirectories, pa11yOpts, failWithIssues } =
				getConfiguration({ constants, inputs })
			const htmlFilePaths = await pluginCore.generateFilePaths({
				absolutePublishDir,
				ignoreDirectories,
				fileAndDirPaths: checkPaths,
			})
			if (debugMode) {
				console.log({ htmlFilePaths })
			}

			const { report, issueCount } = await pluginCore.runPa11y({
				build,
				htmlFilePaths,
				pa11yOpts,
			})
			const log = issueCount === 0 ? console.log : failWithIssues ? build.failBuild : console.warn
			log(generatePostrunMessage(issueCount, report))
		} catch (err) {
			build.failBuild(err.message)
		}
	},
}

/**
 * Generates the message sent to the build log after a11y checks have been peformed.
 * @param {number} issueCount
 * @param {string} report
 */
function generatePostrunMessage(issueCount, report) {
	const humanReadableCount = issueCount === 0 ? 'No' : issueCount
	const summary = `${humanReadableCount} accessibility violations found! ${
		issueCount > 0 ? 'Check the logs above for more information.' : ''
	}`
	return report + '\n' + pico.magenta(summary)
}
