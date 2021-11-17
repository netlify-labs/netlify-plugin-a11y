const path = require('path')

const PUBLISH_DIR = path.join(__dirname, 'publishDir')
const publishDir = path.relative(process.cwd(), PUBLISH_DIR)
// actual test

const pluginCore = require('../../src/pluginCore')
test('generateFilePaths works', async () => {
	const results = await pluginCore.generateFilePaths({
		absolutePublishDir: publishDir,
		fileAndDirPaths: ['/blog', '/about.html'],
		ignoreDirectories: [],
	})
	expect(results).toMatchSnapshot()
})

const pathInResults = (expectedPath, results) => {
	return results.findIndex((r) => r.endsWith(expectedPath)) != -1
}

test('ignoreDirectories works including leading slash', async () => {
	const results = await pluginCore.generateFilePaths({
		fileAndDirPaths: ['/'],
		ignoreDirectories: ['/admin'],
		absolutePublishDir: publishDir,
	})
	expect(pathInResults('publishDir/blog/post1.html', results)).toBe(true)
	expect(pathInResults('publishDir/about.html', results)).toBe(true)
	expect(pathInResults('publishDir/index.html', results)).toBe(true)
	expect(pathInResults('publishDir/admin/index.html', results)).toBe(false)
})

test('ignoreDirectories works without leading slash', async () => {
	const results = await pluginCore.generateFilePaths({
		fileAndDirPaths: ['/'],
		ignoreDirectories: ['admin'],
		absolutePublishDir: publishDir,
	})
	expect(pathInResults('publishDir/blog/post1.html', results)).toBe(true)
	expect(pathInResults('publishDir/about.html', results)).toBe(true)
	expect(pathInResults('publishDir/index.html', results)).toBe(true)
	expect(pathInResults('publishDir/admin/index.html', results)).toBe(false)
})
