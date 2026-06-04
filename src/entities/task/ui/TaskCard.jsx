import { memo, useMemo } from 'react'
import { TASK_STATUS_LABELS } from '../model/types'
import styles from './TaskCard.module.scss'

const formatDate = (deadline) =>
  new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${deadline}T00:00:00`))

const getDeadlineState = (deadline) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const taskDate = new Date(`${deadline}T00:00:00`)

  if (taskDate < today) {
    return 'overdue'
  }

  if (taskDate.getTime() === today.getTime()) {
    return 'today'
  }

  return 'future'
}

export const TaskCard = memo(function TaskCard({
  task,
  statusControl,
  deleteControl,
}) {
  const deadlineState = useMemo(
    () => getDeadlineState(task.deadline),
    [task.deadline],
  )
  const formattedDeadline = useMemo(
    () => formatDate(task.deadline),
    [task.deadline],
  )

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{task.title}</h3>
          <span className={`${styles.badge} ${styles[task.status]}`}>
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </div>
        <p>{task.description}</p>
      </div>

      <div className={styles.footer}>
        <span className={`${styles.deadline} ${styles[deadlineState]}`}>
          {formattedDeadline}
        </span>
        <div className={styles.actions}>
          {statusControl}
          {deleteControl}
        </div>
      </div>
    </article>
  )
})
