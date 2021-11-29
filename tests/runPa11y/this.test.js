const path = require('path')
const { getPa11yOpts } = require('../../src/config')
const filePath = path.relative(process.cwd(), path.join(__dirname, 'publishDir/index.html'))

// actual test
const pluginCore = require('../../src/pluginCore')
test('runPa11y works', async () => {
	const results = await pluginCore.runPa11y({
		build: { failBuild() {} },
		htmlFilePaths: [filePath],
		pa11yOpts: await getPa11yOpts({}),
	})
	expect(results).toMatchSnapshot()
})
