// @ts-check
const http = require('http')
const fs = require('fs/promises')

const SERVER_HOST = 'localhost'
const SERVER_PORT = '9000'
const SERVER_PATH = 'localhost:' + SERVER_PORT

const SERVER_OPTS = {
	host: SERVER_HOST,
	port: SERVER_PORT,
}

const _server = http.createServer(async function (req, res) {
	try {
		// We know all the requests will be for html files
		res.writeHead(200, { 'Content-type': 'text/html' })
		res.end(await fs.readFile(req.url))
	} catch (err) {
		res.statusCode = 500
		res.end(`Error getting the file: ${err}.`)
	}
})

const server = {
	/**
	 * Close the HTTP server
	 */
	close() {
		return _server.close()
	},
	/**
	 * Starts an HTTP server and listens for requests from `localhost` on port `9000`. 
	 */
	listen() {
		return _server.listen(SERVER_OPTS)
	},
}

module.exports = {
	server,
	SERVER_PATH,
}
