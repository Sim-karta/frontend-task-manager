import { memo, useCallback } from 'react'
import {
  DATE_FILTERS,
  SORT_OPTIONS,
  STATUS_FILTERS,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
} from '../../../entities/task/model/types'
import { useTaskContext } from '../../../entities/task/model/useTaskContext'
import { Select } from '../../../shared/ui/select/Select'
import styles from './TaskFilters.module.scss'

const statusOptions = [
  { value: STATUS_FILTERS.all, label: 'Усі статуси' },
  ...Object.values(TASK_STATUSES).map((status) => ({
    value: status,
    label: TASK_STATUS_LABELS[status],
  })),
]

const dateOptions = [
  { value: DATE_FILTERS.all, label: 'Усі дедлайни' },
  { value: DATE_FILTERS.overdue, label: 'Протерміновані' },
  { value: DATE_FILTERS.today, label: 'На сьогодні' },
  { value: DATE_FILTERS.week, label: 'На тиждень' },
]

const sortOptions = [
  { value: SORT_OPTIONS.nearest, label: 'Спочатку найближчі' },
  { value: SORT_OPTIONS.latest, label: 'Спочатку пізніші' },
  { value: SORT_OPTIONS.status, label: 'За статусом' },
]

export const TaskFilters = memo(function TaskFilters() {
  const {
    statusFilter,
    dateFilter,
    sortBy,
    setStatusFilter,
    setDateFilter,
    setSortBy,
  } = useTaskContext()

  const handleStatusChange = useCallback(
    (event) => setStatusFilter(event.target.value),
    [setStatusFilter],
  )
  const handleDateChange = useCallback(
    (event) => setDateFilter(event.target.value),
    [setDateFilter],
  )
  const handleSortChange = useCallback(
    (event) => setSortBy(event.target.value),
    [setSortBy],
  )

  return (
    <div className={styles.filters}>
      <Select
        id="status-filter"
        label="Фільтр статусу"
        value={statusFilter}
        options={statusOptions}
        onChange={handleStatusChange}
      />
      <Select
        id="date-filter"
        label="Фільтр дедлайну"
        value={dateFilter}
        options={dateOptions}
        onChange={handleDateChange}
      />
      <Select
        id="sort-by"
        label="Сортування"
        value={sortBy}
        options={sortOptions}
        onChange={handleSortChange}
      />
    </div>
  )
})
