export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface Professor {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
}

export interface Allocation {
  id: number
  professor: Professor
  subject: Subject
  workload: number
}

export interface Slot {
  id: number
  day: Day
  start: number // Represented as minutes from midnight (e.g., 540 for 9:00 AM)
  end: number
}

export interface Cohort {
  id: number
  name: string
  slots: Slot[]
  allocations: Allocation[]
}
