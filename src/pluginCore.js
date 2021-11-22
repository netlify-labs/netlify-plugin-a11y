// @ts-check

const pa11y = require('pa11y')
const { extname, join } = require('path')
const { isDirectory, isFile } = require('path-type')
const { results: cliReporter } = require('./reporter')
const readdirp = require('readdirp')
const { getPa11yOpts } = require('./config')
const { server, SERVER_PATH } = require('./server')

const EMPTY_ARRAY = []
const ASTERISK = '*'
const HTML_EXT = '.html'
const GLOB_HTML = '*.html'

exports.runPa11y = async function ({ build, htmlFilePaths, wcagLevel }) {
	const pa11yOpts = await getPa11yOpts(wcagLevel)
	let issueCount = 0

	server.listen()

	const results = await Promise.all(
		htmlFilePaths.map(async (path) => {
			try {
				const res = await pa11y(path, pa11yOpts)
				if (res.issues.length) {
					issueCount += res.issues.length
					return cliReporter(res)
				}
			} catch (error) {
				build.failBuild('pa11y failed', { error })
			}
		}),
	)

	server.close()

	await pa11yOpts.browser.close()

	return {
		issueCount,
		report: results.join(''),
	}
}

exports.generateFilePaths = async function ({
	fileAndDirPaths, // array, mix of html and directories
	ignoreDirectories,
	publishDir,
}) {
	const directoryFilter =
		ignoreDirectories.length === 0
			? ASTERISK
			: ignoreDirectories.map(
					// add ! and strip leading slash
					(dir) => `!${dir.replace(/^\/+/, '')}`,
			  )
	const htmlFilePaths = await Promise.all(
		fileAndDirPaths.map((fileAndDirPath) => findHtmlFiles(`${publishDir}${fileAndDirPath}`, directoryFilter)),
	)
	return [].concat(...htmlFilePaths)
}

const findHtmlFiles = async function (fileAndDirPath, directoryFilter) {
	if (await isDirectory(fileAndDirPath)) {
		const filePaths = []
		const stream = readdirp(fileAndDirPath, {
			directoryFilter,
			fileFilter: GLOB_HTML,
		})

		for await (const { path } of stream) {
			filePaths.push(join(SERVER_PATH, fileAndDirPath, path))
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

	return [join(SERVER_PATH, fileAndDirPath)]
}
