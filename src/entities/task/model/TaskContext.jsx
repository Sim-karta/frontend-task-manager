import { useMemo } from 'react'
import { TaskContext } from './context'
import { useTaskDeadlineInfo } from './useTaskDeadlineInfo'
import { useTasks } from './useTasks'

export function TaskProvider({ children }) {
  const {
    tasks,
    visibleTasks,
    loading,
    statusFilter,
    dateFilter,
    sortBy,
    completedCount,
    totalCount,
    visibleCount,
    addTask,
    changeTaskStatus,
    deleteTask,
    setStatusFilter,
    setDateFilter,
    setSortBy,
  } = useTasks()

  const { overdueCount, nearestIncompleteTask } = useTaskDeadlineInfo(tasks)

  const value = useMemo(
    () => ({
      tasks,
      visibleTasks,
      loading,
      statusFilter,
      dateFilter,
      sortBy,
      completedCount,
      totalCount,
      visibleCount,
      overdueCount,
      nearestIncompleteTask,
      addTask,
      changeTaskStatus,
      deleteTask,
      setStatusFilter,
      setDateFilter,
      setSortBy,
    }),
    [
      tasks,
      visibleTasks,
      loading,
      statusFilter,
      dateFilter,
      sortBy,
      completedCount,
      totalCount,
      visibleCount,
      overdueCount,
      nearestIncompleteTask,
      addTask,
      changeTaskStatus,
      deleteTask,
      setStatusFilter,
      setDateFilter,
      setSortBy,
    ],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
