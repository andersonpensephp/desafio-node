
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    handle: ((req, res) => {
      return res.end('OK')
    })
  },
  {
    method: 'POST',
    handle: ((req, res) => {
      const { title, description } = req.body || {}

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(task))
    })
  }
]