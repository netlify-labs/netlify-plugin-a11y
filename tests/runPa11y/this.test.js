const path = require('path')
const filePath = path.relative(process.cwd(), path.join(__dirname, 'publishDir/index.html'))

// actual test
const pluginCore = require('../../src/pluginCore')
test('runPa11y works', async () => {
	const results = await pluginCore.runPa11y({
		htmlFilePaths: [filePath],
		build: { failBuild() {} },
	})
	expect(results).toMatchSnapshot()
})
