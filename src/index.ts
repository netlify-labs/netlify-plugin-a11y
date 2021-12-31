import { getConfiguration } from './config'
import { generateFilePaths, runPa11y } from './pluginCore'
import pico from 'picocolors'

import type { OnPostBuild } from '@netlify/build'

module.exports = {
	async onPostBuild({ constants, inputs, utils: { build }, }) {
		try {
			const { publishDir, checkPaths, ignoreDirectories, failWithIssues, pa11yOpts } = await getConfiguration({
				constants,
				inputs,
			})
			const htmlFilePaths = await generateFilePaths({
				publishDir,
				ignoreDirectories,
				fileAndDirPaths: checkPaths,
			})

			console.log('Checking your pages. This may take a while...')

			const { report, issueCount } = await runPa11y({
				build,
				htmlFilePaths,
				publishDir,
				pa11yOpts,
			})
			const reportSummary =
				`${issueCount === 0 ? 'No' : issueCount} accessibility issues found!` +
				(issueCount > 0 ? ' Check the logs for more information.' : '')

			console.log(report)

			if (failWithIssues && issueCount > 0) {
				build.failBuild(reportSummary)
			} else {
				console.warn(pico.magenta(reportSummary))
			}
		} catch (err) {
			build.failBuild(err.message)
		}
	},
} as {
	onPostBuild: OnPostBuild
}
