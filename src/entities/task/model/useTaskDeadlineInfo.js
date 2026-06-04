import { useMemo } from 'react'
import { TASK_STATUSES } from './types'

const getDateOnly = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const getTaskDate = (deadline) => new Date(`${deadline}T00:00:00`)

export function useTaskDeadlineInfo(tasks) {
  return useMemo(() => {
    const today = getDateOnly(new Date())

    return tasks.reduce(
      (accumulator, task) => {
        const taskDate = getTaskDate(task.deadline)

        if (task.status !== TASK_STATUSES.done && taskDate < today) {
          accumulator.overdueCount += 1
        }

        if (
          task.status !== TASK_STATUSES.done &&
          (!accumulator.nearestIncompleteTask ||
            taskDate < getTaskDate(accumulator.nearestIncompleteTask.deadline))
        ) {
          accumulator.nearestIncompleteTask = task
        }

        return accumulator
      },
      {
        overdueCount: 0,
        nearestIncompleteTask: null,
      },
    )
  }, [tasks])
}
