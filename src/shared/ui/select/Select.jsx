import { memo } from 'react'
import styles from './Select.module.scss'

export const Select = memo(function Select({
  id,
  label,
  options,
  className = '',
  ...props
}) {
  return (
    <label className={`${styles.field} ${className}`} htmlFor={id}>
      <span>{label}</span>
      <select id={id} className={styles.control} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
})
