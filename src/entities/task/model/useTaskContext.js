import { useContext } from 'react'
import { TaskContext } from './context'

export function useTaskContext() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTaskContext must be used inside TaskProvider')
  }

  return context
}
