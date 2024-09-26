import http from 'node:http'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await (const chunck of req) {
    buffers.push(chunck)
  }
 
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch (error) {
    req.body = null
  }

  res.setHeader('content-type', 'json/application')

  const route = routes.find(route => route.method === req.method)

  if (route) {
    route.handle(req, res)
  }

})

server.listen(3001)