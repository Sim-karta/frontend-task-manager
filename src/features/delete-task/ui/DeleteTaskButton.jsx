import { memo, useCallback } from 'react'
import { useTaskContext } from '../../../entities/task/model/useTaskContext'
import { Button } from '../../../shared/ui/button/Button'
import styles from './DeleteTaskButton.module.scss'

export const DeleteTaskButton = memo(function DeleteTaskButton({ task }) {
  const { deleteTask } = useTaskContext()

  const handleClick = useCallback(() => {
    const shouldDelete = window.confirm(`Видалити завдання "${task.title}"?`)

    if (shouldDelete) {
      deleteTask(task.id)
    }
  }, [deleteTask, task.id, task.title])

  return (
    <Button
      type="button"
      variant="secondary"
      className={styles.button}
      onClick={handleClick}
    >
      Видалити
    </Button>
  )
})
