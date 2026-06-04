import { TaskProvider } from '../entities/task/model/TaskContext'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'

function App() {
  return (
    <TaskProvider>
      <DashboardPage />
    </TaskProvider>
  )
}

export default App
