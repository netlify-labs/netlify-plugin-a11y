import http, { Server } from 'http'
import fs from 'fs'
import path from 'path'
import MIME_TYPES from './mimeTypes.json'

const HTML_EXT = '.html'

const SERVER_HOST = 'localhost'
const SERVER_PORT = '9000'
const SERVER_ADDRESS = 'localhost:' + SERVER_PORT

const SERVER_OPTS = {
	host: SERVER_HOST,
	port: SERVER_PORT,
}

const basePath = process.cwd()

class StaticServer {
	instance: Server
	constructor(publishDir: string) {
		this.instance = http.createServer(function (req, res) {
			const ext = path.extname(req.url)
			const filepath = ext === HTML_EXT ? path.join(basePath, req.url) : path.join(basePath, publishDir, req.url)

			res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' })

			const stream = fs.createReadStream(filepath)

			stream
				.on('open', function () {
					stream.pipe(res)
				})
				.on('error', function (err) {
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
}

export {
	StaticServer,
	SERVER_ADDRESS,
}
