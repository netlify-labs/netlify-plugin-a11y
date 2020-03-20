const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'publishDir');
// actual test
const pluginCore = require('../../plugin/pluginCore.js');
test('generateFilePaths works', async () => {
  const results = await pluginCore.generateFilePaths({
    fileAndDirPaths: ['/blog', '/about.html'],
    BUILD_DIR
  });
  expect(results).toMatchSnapshot();
});
