import { useCallback, useState } from 'react'
import { useTaskContext } from '../../../entities/task/model/useTaskContext'

const getToday = () => new Date().toISOString().slice(0, 10)

export function useAddTaskForm() {
  const { addTask } = useTaskContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState(getToday())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value)
  }, [])

  const handleDescriptionChange = useCallback((event) => {
    setDescription(event.target.value)
  }, [])

  const handleDeadlineChange = useCallback((event) => {
    setDeadline(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      if (!title.trim()) {
        return
      }

      setIsSubmitting(true)
      await addTask({
        title: title.trim(),
        description: description.trim() || 'Без опису',
        deadline,
      })

      setTitle('')
      setDescription('')
      setDeadline(getToday())
      setIsSubmitting(false)
    },
    [addTask, deadline, description, title],
  )

  return {
    title,
    description,
    deadline,
    isSubmitting,
    handleTitleChange,
    handleDescriptionChange,
    handleDeadlineChange,
    handleSubmit,
  }
}
