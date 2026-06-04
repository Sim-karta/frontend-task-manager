import { memo } from 'react'
import { useAddTaskForm } from '../model/useAddTaskForm'
import { Button } from '../../../shared/ui/button/Button'
import { Input } from '../../../shared/ui/input/Input'
import styles from './AddTaskForm.module.scss'

export const AddTaskForm = memo(function AddTaskForm() {
  const {
    title,
    description,
    deadline,
    isSubmitting,
    handleTitleChange,
    handleDescriptionChange,
    handleDeadlineChange,
    handleSubmit,
  } = useAddTaskForm()

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h2>Нове завдання</h2>
        <p>Додайте назву, короткий опис і дату завершення.</p>
      </div>

      <Input
        id="task-title"
        label="Назва"
        placeholder="Наприклад: виконати вебпрограмування"
        value={title}
        onChange={handleTitleChange}
        required
      />
      <Input
        id="task-description"
        label="Опис"
        placeholder="Що потрібно зробити?"
        textarea
        value={description}
        onChange={handleDescriptionChange}
      />
      <Input
        id="task-deadline"
        label="Дедлайн"
        type="date"
        value={deadline}
        onChange={handleDeadlineChange}
        required
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Додаємо...' : 'Додати завдання'}
      </Button>
    </form>
  )
})
