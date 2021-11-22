// @ts-check
const http = require('http')
const fs = require('fs/promises')

const SERVER_HOST = 'localhost'
const SERVER_PORT = '9000'
const SERVER_PATH = 'localhost:' + SERVER_PORT

const server = http.createServer(async function (req, res) {
	try {
		res.writeHead(200, { 'Content-type': 'text/html' })
		res.end(await fs.readFile(req.url))
	} catch (err) {
		res.statusCode = 500
		res.end(`Error getting the file: ${err}.`)
	}
})

module.exports = {
	server,
	SERVER_HOST,
	SERVER_PATH,
	SERVER_PORT,
}
