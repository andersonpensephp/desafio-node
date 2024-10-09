import http from 'node:http'
import { routes } from './routes.js'
import { extractQuery } from './utils/extract-query.js'

const PORT = process.env.PORT

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

  const route = routes.find(route => route.method === req.method && route.path.test(req.url))
  
  if (route) {
    const routeParams = req.url.match(route.path)
    const { query } = routeParams.groups
    const routeQuery = extractQuery(query)
    
    req.params = {...routeParams.groups}
    req.query = routeQuery
    route.handle(req, res)
  }

})

server.listen(PORT)