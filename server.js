import { createServer } from 'http'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { buildSchema, graphql } from 'graphql'

const DB_FILE = './tasks_db.json'

const schema = buildSchema(`
  enum TaskStatus {
    todo
    progress
    done
  }

  input TaskInput {
    title: String!
    description: String
    status: TaskStatus!
    deadline: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    deadline: String!
    createdAt: String!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    createTask(input: TaskInput!): Task!
    updateTaskStatus(id: ID!, status: TaskStatus!): Task!
    deleteTask(id: ID!): Task!
  }
`)

const readDB = () => {
  if (!existsSync(DB_FILE)) {
    const today = new Date()
    const addDays = (days) => {
      const date = new Date(today)
      date.setDate(today.getDate() + days)
      return date.toISOString().slice(0, 10)
    }
    const initialTasks = [
      {
        id: '1',
        title: 'Підготувати план спринту',
        description: 'Описати пріоритети, дедлайни та очікувані результати.',
        status: 'progress',
        deadline: addDays(1),
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Перевірити протерміновані задачі',
        description: 'Оновити статуси та перенести задачі з ризиком.',
        status: 'todo',
        deadline: addDays(-1),
        createdAt: new Date().toISOString(),
      },
    ]
    writeFileSync(DB_FILE, JSON.stringify(initialTasks, null, 2))
    return initialTasks
  }
  return JSON.parse(readFileSync(DB_FILE, 'utf-8'))
}

const writeDB = (data) => {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

const rootValue = {
  tasks: () => {
    return readDB()
  },
  createTask: ({ input }) => {
    const tasks = readDB()
    const newTask = {
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      ...input,
    }
    tasks.unshift(newTask)
    writeDB(tasks)
    return newTask
  },
  updateTaskStatus: ({ id, status }) => {
    const tasks = readDB()
    const task = tasks.find((t) => t.id === id)
    if (!task) throw new Error('Task not found')
    task.status = status
    writeDB(tasks)
    return task 
  },
  deleteTask: ({ id }) => {
    let tasks = readDB()
    const taskToDelete = tasks.find((t) => t.id === id)
    if (!taskToDelete) throw new Error('Task not found')
    tasks = tasks.filter((t) => t.id !== id)
    writeDB(tasks)
    return { id }
  },
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/graphql') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', async () => {
      try {
        const { query, variables } = JSON.parse(body)

        const result = await graphql({
          schema,
          source: query,
          rootValue,
          variableValues: variables,
        })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      } catch (err) {
        res.statusCode = 500
        res.end(JSON.stringify({ errors: [{ message: err.message }] }))
      }
    })
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`🚀 Справжній GraphQL бекенд запущено на http://localhost:${PORT}/graphql`)
})