export const TASK_STATUSES = {
  todo: 'todo',
  progress: 'progress',
  done: 'done',
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.todo]: 'Не виконано',
  [TASK_STATUSES.progress]: 'В процесі',
  [TASK_STATUSES.done]: 'Виконано',
}

export const STATUS_FILTERS = {
  all: 'all',
  ...TASK_STATUSES,
}

export const DATE_FILTERS = {
  all: 'all',
  overdue: 'overdue',
  today: 'today',
  week: 'week',
}

export const SORT_OPTIONS = {
  nearest: 'nearest',
  latest: 'latest',
  status: 'status',
}
