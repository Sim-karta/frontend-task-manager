import { memo, useCallback } from 'react'
import { TASK_STATUS_LABELS, TASK_STATUSES } from '../../../entities/task/model/types'
import { useTaskContext } from '../../../entities/task/model/useTaskContext'
import { Select } from '../../../shared/ui/select/Select'
import styles from './StatusDropdown.module.scss'

const statusOptions = Object.values(TASK_STATUSES).map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}))

export const StatusDropdown = memo(function StatusDropdown({ task }) {
  const { changeTaskStatus } = useTaskContext()

  const handleChange = useCallback(
    (event) => changeTaskStatus(task.id, event.target.value),
    [changeTaskStatus, task.id],
  )

  return (
    <Select
      id={`status-${task.id}`}
      label="Статус"
      className={styles.status}
      value={task.status}
      options={statusOptions}
      onChange={handleChange}
    />
  )
})
