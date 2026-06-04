import { AddTaskForm } from '../../../features/add-task/ui/AddTaskForm'
import { TaskList } from '../../../widgets/task-list/ui/TaskList'
import styles from './DashboardPage.module.scss'

export function DashboardPage() {
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.kicker}>Task Manager</p>
          <h1>Керування завданнями</h1>
          <p>
            Плануйте роботу, відстежуйте статуси й контролюйте дедлайни в
            одному робочому просторі.
          </p>
        </div>
      </section>

      <section className={styles.layout}>
        <AddTaskForm />
        <TaskList />
      </section>
    </main>
  )
}
