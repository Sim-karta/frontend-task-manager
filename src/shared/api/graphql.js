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
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operation,
        variables,
      }),
    })

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    const data = result.data

    // Адаптуємо відповідь сервера під специфічні очікування вашого фронтенду:
    if (operation.includes('FetchTasks')) {
      return { tasks: data.tasks }
    }

    if (operation.includes('CreateTask')) {
      return { task: data.createTask } // перетворюємо data.createTask на { task }
    }

    if (operation.includes('UpdateTaskStatus')) {
      return { task: data.updateTaskStatus } // перетворюємо data.updateTaskStatus на { task }
    }

    if (operation.includes('DeleteTask')) {
      return { task: data.deleteTask } // перетворюємо data.deleteTask на { task }
    }

    return data
  } catch (error) {
    console.error('GraphQL Request Error:', error)
    throw error
  }
}