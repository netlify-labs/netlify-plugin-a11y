// @ts-check
const http = require('http')
const fs = require('fs')
const path = require('path')

const HTML_EXT = '.html'

const SERVER_HOST = 'localhost'
const SERVER_PORT = '9000'
const SERVER_ADDRESS = 'localhost:' + SERVER_PORT

const SERVER_OPTS = {
	host: SERVER_HOST,
	port: SERVER_PORT,
}

const basePath = process.cwd()

const contentTypesByExt = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword',
}

class StaticServer {
	/**
	 * @param {string} publishDir
	 */
	constructor(publishDir) {
		this.instance = http.createServer(async function (req, res) {
			const ext = path.extname(req.url)
			const filepath = ext === HTML_EXT ? path.join(basePath, req.url) : path.join(basePath, publishDir, req.url)

			res.writeHead(200, { 'Content-type': contentTypesByExt[ext] || 'text/plain' })
			const stream = fs.createReadStream(filepath, { encoding: 'utf-8' })

			stream.on('open', function () {
				stream.pipe(res)
			})

			stream.on('error', function (err) {
				res.statusCode = 500
				res.end(`Error getting the file: ${err}.`)
			})

			res.on('close', function () {
				stream.destroy()
			})
		})
	}

	listen() {
		return this.instance.listen(SERVER_OPTS)
	}

	close() {
		return this.instance.close()
	}
}

module.exports = {
	StaticServer,
	SERVER_ADDRESS,
}
