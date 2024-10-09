
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRouterPath } from './utils/build-route-path.js'
import { buildRoutePath } from '../../node-init/src/utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRouterPath('/tasks'),
    handle: ((req, res) => {
      const { title, description } = req.query || {}
      
      const titleDecode = decodeURI(title)
      const descriptionDecode = decodeURI(description)

      const objQuery = title || description ? {
        ...(title) && { title: titleDecode },
        ...(description) && { description: descriptionDecode }
      } : null

      const data = database.select('tasks', objQuery)
      
      return res.end(JSON.stringify(data))
    })
  },
  {
    method: 'POST',
    path: buildRouterPath('/tasks'),
    handle: ((req, res) => {
      const { title, description } = req.body || {}

      const task = {
        id: randomUUID(),
        ...(title?.length) && { title },
        ...(description?.length) && { description },
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      const result = database.insert('tasks', task)

      if (result?.success) {
        return res.writeHead(201).end(JSON.stringify(result))
      }
     
      return res.writeHead(500).end(JSON.stringify(result))

    })
  },
  {
    method: 'PUT',
    path: buildRouterPath('/tasks/:id'),
    handle: ((req, res) => {
      const { id } = req.params
      const body = req.body

      const data = database.update('tasks', id, body)

      return res.writeHead(201).end(JSON.stringify(data))
    })
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handle: ((req, res) => {
      const { id } = req.params

      const data = database.delete('tasks', id)
      return res.writeHead(201).end(JSON.stringify(data))
    })
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handle: ((req, res) => {
      const { id } = req.params
      const body = req.body

      const data = database.completed('tasks', id, body)

      return res.writeHead(201).end(JSON.stringify(data))
    })
  }
]