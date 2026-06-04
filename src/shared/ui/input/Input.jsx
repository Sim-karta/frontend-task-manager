import { memo } from 'react'
import styles from './Input.module.scss'

export const Input = memo(function Input({
  id,
  label,
  textarea = false,
  className = '',
  ...props
}) {
  const Control = textarea ? 'textarea' : 'input'

  return (
    <label className={`${styles.field} ${className}`} htmlFor={id}>
      <span>{label}</span>
      <Control id={id} className={styles.control} {...props} />
    </label>
  )
})
