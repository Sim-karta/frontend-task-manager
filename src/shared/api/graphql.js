const STORAGE_KEY = 'task-manager:graphql-tasks:v2'

const today = new Date()
const addDays = (days) => {
  const date = new Date(today)
  date.setDate(today.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const createInitialTasks = () => [
  {
    id: crypto.randomUUID(),
    title: 'Підготувати план спринту',
    description: 'Описати пріоритети, дедлайни та очікувані результати.',
    status: 'progress',
    deadline: addDays(1),
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Перевірити протерміновані задачі',
    description: 'Оновити статуси та перенести задачі з ризиком.',
    status: 'todo',
    deadline: addDays(-1),
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Закрити звіт по модулю',
    description: 'Зібрати фінальну інформацію та позначити виконання.',
    status: 'done',
    deadline: addDays(5),
    createdAt: new Date().toISOString(),
  },
]

const canUseStorage = () => typeof window !== 'undefined' && window.localStorage

const saveTaskStore = () => {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taskStore))
  }
}

const readTaskStore = () => {
  if (!canUseStorage()) {
    return createInitialTasks()
  }

  const storedTasks = window.localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    const initialTasks = createInitialTasks()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks))
    return initialTasks
  }

  try {
    return JSON.parse(storedTasks)
  } catch {
    const initialTasks = createInitialTasks()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks))
    return initialTasks
  }
}

let taskStore = readTaskStore()

export const fetchTasksQuery = `
  query FetchTasks {
    tasks {
      id
      title
      description
      status
      deadline
      createdAt
    }
  }
`

export const createTaskMutation = `
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      deadline
      createdAt
    }
  }
`

export const updateTaskStatusMutation = `
  mutation UpdateTaskStatus($id: ID!, $status: TaskStatus!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

export const deleteTaskMutation = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`

export async function runGraphqlOperation(operation, variables = {}) {
  await new Promise((resolve) => {
    setTimeout(resolve, 120)
  })

  if (operation.includes('FetchTasks')) {
    return { tasks: [...taskStore] }
  }

  if (operation.includes('CreateTask')) {
    const task = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...variables.input,
    }

    taskStore = [task, ...taskStore]
    saveTaskStore()
    return { task }
  }

  if (operation.includes('UpdateTaskStatus')) {
    let updatedTask = null

    taskStore = taskStore.map((task) => {
      if (task.id !== variables.id) {
        return task
      }

      updatedTask = {
        ...task,
        status: variables.status,
      }
      return updatedTask
    })

    saveTaskStore()
    return { task: updatedTask }
  }

  if (operation.includes('DeleteTask')) {
    taskStore = taskStore.filter((task) => task.id !== variables.id)
    saveTaskStore()
    return { task: { id: variables.id } }
  }

  throw new Error('Unknown GraphQL operation')
}
