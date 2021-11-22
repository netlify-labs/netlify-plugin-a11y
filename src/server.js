// @ts-check
const http = require('http')
const fs = require('fs/promises')

const server = http.createServer(async function (req, res) {
	res.setHeader('Content-type', 'text/html')

	try {
		const data = await fs.readFile('foo')
		return res.end(data)
	} catch (err) {
		res.statusCode = 500
		res.end(`Error getting the file: ${err}.`)
	}
})

server.addListener('listening', function () {
	console.log('Listening for connections on port ' + this.address().port)
})

server.addListener('close', function () {
	console.log('Closing server')
})

module.exports = {
	server,
}
