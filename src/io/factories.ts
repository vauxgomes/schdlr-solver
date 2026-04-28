import type { Allocation, Cohort, Day, Professor, Slot, Subject } from '../types/domain'

export function makeSlot(day: Day, start: number, end: number, id: number = 0): Slot {
  return { id, day, start, end }
}

export function makeProfessor(id: number, name: string): Professor {
  return { id, name }
}

export function makeSubject(id: number, name: string): Subject {
  return { id, name }
}

export function makeAllocation(
  id: number,
  professor: Professor,
  subject: Subject,
  workload: number,
): Allocation {
  return { id, professor, subject, workload }
}

export function makeCohort(
  id: number,
  name: string,
  slots: Slot[] = [],
  allocations: Allocation[] = [],
): Cohort {
  return { id, name, slots, allocations }
}
