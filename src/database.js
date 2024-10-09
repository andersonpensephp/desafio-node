import fs from 'node:fs/promises'

const dataBasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(dataBasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist () {
    fs.writeFile(dataBasePath, JSON.stringify(this.#database))
  }

  select (table, query) {
    const data = this.#database[table] || []

    if (query) {
      const searchData = data.filter(elem => {
        return Object.entries(query).some(([key, value]) => {
          return elem[key].toLocaleLowerCase().includes(value.toLocaleLowerCase())
        })

      })
      
      return searchData
    }
    return data
  } 

  insert (table, data) {
    const { title, description } = data

    if (title === undefined || description === undefined) {
      return {
        success: false,
        error: `Dados faltando para a criação da task. Title: ${title}, Description: ${description}`
      }
    }
    
    if (Array.isArray(this.#database[table])) {
      this.#database[table] = [...this.#database[table], data]
    } else {
      this.#database[table] = [data]
    }
    
    this.#persist()

    return {
      success: true,
      data
    }
  }

  update (table, id, body) {
    const dataIndex = this.#database[table].find(data => data.id === id)

    if (dataIndex) {
      const { title, description } = body
      const data = this.#database[table]?.map(data => {
        if (data.id === id) {
          const updated_at = new Date()
          return {
            ...data,
            ...(title) && { title },
            ...(description) && { description },
            ...{ updated_at }
          }
        }
        return data
      })

      this.#database[table] = data

      return {
        success: true
      }
    }

    return {
      success: false,
      error: `Task não encontrada :(, id: ${id}`
    }
  }

  delete (table, id) {
    const dataIndex = this.#database[table].find(data => data.id === id)
    if (dataIndex) {
      const data = this.#database[table]?.filter(data => data.id !== id)
      this.#database[table] = data

      return {
        success: true
      }
    }

    return {
      success: false,
      error: `Task não encontrada :(, id: ${id}`
    }
  }

  completed (table, id, body) {
    const { completed } = body
    
    const dataIndex = this.#database[table].find(data => data.id === id)
    if (dataIndex) {
      const data = this.#database[table].map(data => {
        if (data.id === id) {
          return {
            ...data,
            completed_at: completed ? new Date() : null
          }
        }
        return data
      })

      this.#database[table] = data

      return {
        success: true
      }
    }

    return {
      success: false,
      error: `Task não encontrada :(, id: ${id}`
    }
  }
}