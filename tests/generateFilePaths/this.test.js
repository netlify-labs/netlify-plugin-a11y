const fs = require('fs')
const path = require('path')

const PUBLISH_DIR = path.join(__dirname, 'publishDir')
// actual test
const pluginCore = require('../../plugin/pluginCore.js')
test('generateFilePaths works', async () => {
	const results = await pluginCore.generateFilePaths({
		absolutePublishDir: PUBLISH_DIR,
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
		absolutePublishDir: PUBLISH_DIR,
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
		absolutePublishDir: PUBLISH_DIR,
	})
	expect(pathInResults('publishDir/blog/post1.html', results)).toBe(true)
	expect(pathInResults('publishDir/about.html', results)).toBe(true)
	expect(pathInResults('publishDir/index.html', results)).toBe(true)
	expect(pathInResults('publishDir/admin/index.html', results)).toBe(false)
})
