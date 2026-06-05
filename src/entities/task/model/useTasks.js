import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createTaskMutation,
  deleteTaskMutation,
  fetchTasksQuery,
  runGraphqlOperation,
  updateTaskStatusMutation,
} from '../../../shared/api/graphql'
import {
  DATE_FILTERS,
  SORT_OPTIONS,
  STATUS_FILTERS,
  TASK_STATUSES,
} from './types'

const statusWeight = {
  [TASK_STATUSES.todo]: 1,
  [TASK_STATUSES.progress]: 2,
  [TASK_STATUSES.done]: 3,
}

const getDateOnly = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const getTaskDate = (deadline) => new Date(`${deadline}T00:00:00`)

const isInDateFilter = (deadline, dateFilter) => {
  if (dateFilter === DATE_FILTERS.all) {
    return true
  }

  const today = getDateOnly(new Date())
  const taskDate = getTaskDate(deadline)

  if (dateFilter === DATE_FILTERS.overdue) {
    return taskDate < today
  }

  if (dateFilter === DATE_FILTERS.today) {
    return taskDate.getTime() === today.getTime()
  }

  if (dateFilter === DATE_FILTERS.week) {
    const weekEnd = new Date(today)
    weekEnd.setDate(today.getDate() + 7)
    return taskDate >= today && taskDate <= weekEnd
  }

  return true
}

const sortTasks = (tasks, sortBy) => {
  const sortedTasks = [...tasks]

  if (sortBy === SORT_OPTIONS.latest) {
    return sortedTasks.sort(
      (firstTask, secondTask) =>
        getTaskDate(secondTask.deadline) - getTaskDate(firstTask.deadline),
    )
  }

  if (sortBy === SORT_OPTIONS.status) {
    return sortedTasks.sort(
      (firstTask, secondTask) =>
        statusWeight[firstTask.status] - statusWeight[secondTask.status],
    )
  }

  return sortedTasks.sort(
    (firstTask, secondTask) =>
      getTaskDate(firstTask.deadline) - getTaskDate(secondTask.deadline),
  )
}

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.all)
  const [dateFilter, setDateFilter] = useState(DATE_FILTERS.all)
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.nearest)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    runGraphqlOperation(fetchTasksQuery).then(({ tasks: loadedTasks }) => {
      if (!isMounted) {
        return
      }

      setTasks(loadedTasks)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const addTask = useCallback(async (taskDraft) => {
    const { task } = await runGraphqlOperation(createTaskMutation, {
      input: {
        ...taskDraft,
        status: TASK_STATUSES.todo,
      },
    })

    setTasks((currentTasks) => [task, ...currentTasks])
  }, [])

  const changeTaskStatus = useCallback(async (taskId, status) => {
    const { task } = await runGraphqlOperation(updateTaskStatusMutation, {
      id: taskId,
      status,
    })

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, ...task } : currentTask,
      ),
    )
  }, [])

  const deleteTask = useCallback(async (taskId) => {
    await runGraphqlOperation(deleteTaskMutation, {
      id: taskId,
    })

    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== taskId),
    )
  }, [])

  const visibleTasks = useMemo(
    () =>
      sortTasks(
        tasks.filter((task) => {
          const matchesStatus =
            statusFilter === STATUS_FILTERS.all || task.status === statusFilter
          const matchesDate = isInDateFilter(task.deadline, dateFilter)

          return matchesStatus && matchesDate
        }),
        sortBy,
      ),
    [tasks, statusFilter, dateFilter, sortBy],
  )

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === TASK_STATUSES.done).length,
    [tasks],
  )

  return {
    tasks,
    visibleTasks,
    loading,
    statusFilter,
    dateFilter,
    sortBy,
    completedCount,
    totalCount: tasks.length,
    visibleCount: visibleTasks.length,
    addTask,
    changeTaskStatus,
    deleteTask,
    setStatusFilter,
    setDateFilter,
    setSortBy,
  }
}
