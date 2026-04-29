import type { Day, Slot, TimeString } from '../types/domain'

// --- Constants

const week: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// --- Day

export function nextDay(day: Day): Day | null {
  const index = week.indexOf(day)

  if (index === -1 || index === week.length - 1) return null
  return week[index + 1] as Day
}

// --- Time

export function slotDuration(slot: Slot): number {
  return slot.end - slot.start
}

export function slotsAreAdjacent(a: Slot, b: Slot): boolean {
  return a.end === b.start
}

// --- Inter-shift rest period

function minutesToNextDay(slot: Slot): number {
  return 24 * 60 - slot.end
}

export function violatesRestPeriod(a: Slot, b: Slot, minRest: number = 11 * 60): boolean {
  if (a.day === b.day) return false

  const restTime = minutesToNextDay(a) + b.start
  return restTime < minRest
}

// --- Format

export function timeToMinutes(time: TimeString): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours! * 60 + minutes!
}

export function minutesToTime(minutes: number): TimeString {
  const hours = Math.floor(minutes / 60)
  const remain = minutes % 60

  return `${hours.toString().padStart(2, '0')}:${remain.toString().padStart(2, '0')}` as TimeString
}

// --- Clash detection

// A |----------|
// B       |----------|  → clash with A and C
// C              |----------|  → no clash with A
export function hasConflict(a: Slot, b: Slot): boolean {
  if (a.day !== b.day) return false

  return a.start < b.end && b.start < a.end
}
