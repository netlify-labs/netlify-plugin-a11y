import pa11y from 'pa11y'
import { extname, join } from 'path'
import { isDirectory, isFile } from 'path-type'
import { results as cliReporter } from './reporter'
import readdirp from 'readdirp'
import { StaticServer, SERVER_ADDRESS } from './server'

import type { NetlifyPluginUtils } from '@netlify/build'
import type { Pa11yOpts } from './config'

const EMPTY_ARRAY = []
const ASTERISK = '*';
const HTML_EXT = '.html'
const GLOB_HTML = '*.html'

export const runPa11y = async function ({
	build,
	htmlFilePaths,
	pa11yOpts,
	publishDir,
}: {
	build: NetlifyPluginUtils['build']
	htmlFilePaths: string[]
	pa11yOpts: Pa11yOpts
	publishDir: string
}) {
	let issueCount = 0

	const staticServer = new StaticServer(publishDir).listen()

	const results = await Promise.all(
		htmlFilePaths.map(async (filePath) => {
			try {
				const res = await pa11y(join(SERVER_ADDRESS, filePath), pa11yOpts)
				if (res.issues.length) {
					issueCount += res.issues.length
					return cliReporter(res)
				}
			} catch (error) {
				build.failBuild('pa11y failed', { error })
			}
		}),
	)

	staticServer.close()

	await pa11yOpts.browser.close()

	return {
		issueCount,
		report: results.join(''),
	}
}

export const generateFilePaths = async function ({
	fileAndDirPaths, // array, mix of html and directories
	ignoreDirectories,
	publishDir,
}: {
	fileAndDirPaths: string[]
	ignoreDirectories: string[]
	publishDir: string
}) {
	const directoryFilter =
		ignoreDirectories.length === 0
			? ASTERISK
			: ignoreDirectories.map(
					// add ! and strip leading and trailing slashes
					(dir) => `!${dir.replace(/^\/|\/$/g, '')}`,
			  )
	const htmlFilePaths = await Promise.all(
		fileAndDirPaths.map((fileAndDirPath) => findHtmlFiles(`${publishDir}${fileAndDirPath}`, directoryFilter)),
	)

	return [].concat(...htmlFilePaths) as string[]
}

const findHtmlFiles = async function (fileAndDirPath: string, directoryFilter: '*' | string[]): Promise<string[]> {
	if (await isDirectory(fileAndDirPath)) {
		const filePaths = []
		const stream = readdirp(fileAndDirPath, {
			directoryFilter,
			fileFilter: GLOB_HTML,
		})

		for await (const { path } of stream) {
			filePaths.push(join(fileAndDirPath, path))
		}

		return filePaths
	}

	if (!(await isFile(fileAndDirPath))) {
		console.warn(
			`Path ${fileAndDirPath} was provided in "checkPaths", but does not exist. This could indicate a problem with your build. If you want, you can simply delete this path from your "checkPaths" key in netlify.toml`,
		)
		return EMPTY_ARRAY
	}

	if (extname(fileAndDirPath) !== HTML_EXT) {
		return EMPTY_ARRAY
	}

	return [fileAndDirPath]
}
