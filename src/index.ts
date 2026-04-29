// Types
export type {
  Allocation,
  Cohort,
  Day,
  Professor,
  Program,
  Slot,
  Subject,
  TimeString,
} from './types/domain'
export { ScheduleGraph } from './types/graph'
export type { Edge, EdgeType, Vertex } from './types/graph'

// I/O
export { makeAllocation, makeCohort, makeProfessor, makeSlot, makeSubject } from './io/factories'
export { loadSchedule, loadScheduleFromStream } from './io/reader'

// Core
export {
  hasConflict as hasTimeClash,
  minutesToTime,
  nextDay,
  slotDuration,
  slotsAreAdjacent,
  timeToMinutes,
  violatesRestPeriod,
} from './core/utils'
