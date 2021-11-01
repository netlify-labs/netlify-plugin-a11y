const pa11y = require('pa11y');
const { extname } = require('path');
const { isDirectory, isFile } = require('path-type');
const { results: cliReporter } = require('pa11y/lib/reporters/cli');
const readdirp = require('readdirp');
const EMPTY_ARRAY = [];
const ASTERISK = '*';
const HTML_EXT = '.html';
const GLOB_HTML = '*.html';
exports.runPa11y = async function ({ htmlFilePaths, pa11yOpts, build }) {
    let issueCount = 0;
    const results = await Promise.all(htmlFilePaths.map(async (path) => {
        try {
            const res = await pa11y(path, pa11yOpts);
            if (res.issues && res.issues.length) {
                issueCount += res.issues.length;
                return cliReporter(res);
            }
        }
        catch (error) {
            build.failBuild('pa11y failed', { error });
        }
    }));
    return {
        issueCount,
        report: results.join(''),
    };
};
exports.generateFilePaths = async function ({ fileAndDirPaths, ignoreDirectories, absolutePublishDir, }) {
    const excludeDirGlobs = ignoreDirectories.map((dir) => `!${dir.replace(/^\/+/, '')}`);
    const htmlFilePaths = await Promise.all(fileAndDirPaths.map((fileAndDirPath) => findHtmlFiles(`${absolutePublishDir}${fileAndDirPath}`, excludeDirGlobs)));
    return [].concat(...htmlFilePaths);
};
const findHtmlFiles = async function (fileAndDirPath, directoryFilter) {
    if (await isDirectory(fileAndDirPath)) {
        const filePaths = [];
        const stream = readdirp(fileAndDirPath, {
            fileFilter: GLOB_HTML,
            directoryFilter: !!directoryFilter.length ? directoryFilter : ASTERISK,
        });
        for await (const { fullPath } of stream) {
            filePaths.push(fullPath);
        }
        return filePaths;
    }
    if (!(await isFile(fileAndDirPath))) {
        console.warn(`Folder ${fileAndDirPath} was provided in "checkPaths", but does not exist - it either indicates something went wrong with your build, or you can simply delete this folder from your "checkPaths" in netlify.toml`);
        return EMPTY_ARRAY;
    }
    if (extname(fileAndDirPath) !== HTML_EXT) {
        return EMPTY_ARRAY;
    }
    return [fileAndDirPath];
};
