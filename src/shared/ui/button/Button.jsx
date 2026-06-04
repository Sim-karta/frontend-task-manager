import { memo } from 'react'
import styles from './Button.module.scss'

export const Button = memo(function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
})
