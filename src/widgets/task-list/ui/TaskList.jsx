import { memo } from 'react'
import { useTaskContext } from '../../../entities/task/model/useTaskContext'
import { TaskCard } from '../../../entities/task/ui/TaskCard'
import { StatusDropdown } from '../../../features/change-task-status/ui/StatusDropdown'
import { DeleteTaskButton } from '../../../features/delete-task/ui/DeleteTaskButton'
import { TaskFilters } from '../../../features/filter-tasks/ui/TaskFilters'
import styles from './TaskList.module.scss'

export const TaskList = memo(function TaskList() {
  const {
    visibleTasks,
    loading,
    completedCount,
    totalCount,
    visibleCount,
  } = useTaskContext()

  return (
    <section className={styles.section}>
      <div className={styles.summary}>
        <div>
          <h2>Список завдань</h2>
          <p>
            {completedCount} з {totalCount} завдань виконано
          </p>
        </div>
        <span>{visibleCount} показано</span>
      </div>

      <TaskFilters />

      <div className={styles.list}>
        {loading && <p className={styles.empty}>Завантаження завдань...</p>}

        {!loading &&
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              statusControl={<StatusDropdown task={task} />}
              deleteControl={<DeleteTaskButton task={task} />}
            />
          ))}

        {!loading && visibleTasks.length === 0 && (
          <p className={styles.empty}>
            Немає завдань для вибраних фільтрів.
          </p>
        )}
      </div>
    </section>
  )
})
