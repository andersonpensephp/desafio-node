import { parse } from 'csv-parse'
import fs from 'node:fs'

const getPathCsv = new URL('./tarefas.csv', import.meta.url)

const proccessFile = async () => {
  const parser = fs.createReadStream(getPathCsv).pipe(parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
  }))
  
  for await (const record of parser) {
    const [title, description] = record

    try {
      const url = process.env.BASE_URL
      
      await fetch(`${url}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: JSON.stringify({
          title,
          description
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

}

proccessFile()