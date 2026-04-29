import { describe, expect, it } from 'vitest'
import {
  hasConflict,
  nextDay,
  slotDuration,
  slotsAreAdjacent,
  violatesRestPeriod,
} from '../../src/core/utils'
import { makeSlot } from '../../src/io/factories'

// --- Day

describe('nextDay', () => {
  it('returns the following day', () => {
    expect(nextDay('Monday')).toBe('Tuesday')
    expect(nextDay('Friday')).toBe('Saturday')
  })

  it('returns null on Sunday (last day)', () => {
    expect(nextDay('Sunday')).toBeNull()
  })
})

// --- Time

describe('slotDuration', () => {
  it('returns the duration in minutes', () => {
    const slot = makeSlot('Monday', 540, 630) // 9:00 → 10:30
    expect(slotDuration(slot)).toBe(90)
  })
})

describe('slotsAreAdjacent', () => {
  it('returns true when b starts exactly when a ends', () => {
    const a = makeSlot('Monday', 540, 630)
    const b = makeSlot('Monday', 630, 720)

    expect(slotsAreAdjacent(a, b)).toBe(true)
  })

  it('returns false when there is a gap between slots', () => {
    const a = makeSlot('Monday', 540, 630)
    const b = makeSlot('Monday', 660, 750)

    expect(slotsAreAdjacent(a, b)).toBe(false)
  })

  it('returns false when slots overlap', () => {
    const a = makeSlot('Monday', 540, 660)
    const b = makeSlot('Monday', 630, 720)

    expect(slotsAreAdjacent(a, b)).toBe(false)
  })
})

// --- Inter-shift rest period

describe('violatesRestPeriod', () => {
  it('returns true when rest between night and next morning is under 11h', () => {
    const night = makeSlot('Monday', 1200, 1320) // 20:00 → 22:00
    const morning = makeSlot('Tuesday', 420, 510) // 07:00 → 08:30

    // rest = (1440 - 1320) + 420 = 120 + 420 = 540 min = 9h < 11h
    expect(violatesRestPeriod(night, morning)).toBe(true)
  })

  it('returns false when rest is exactly 11h', () => {
    const night = makeSlot('Monday', 1080, 1200) // 18:00 → 20:00
    const morning = makeSlot('Tuesday', 420, 510) // 07:00 → 08:30

    // rest = (1440 - 1200) + 420 = 240 + 420 = 660 min = 11h
    expect(violatesRestPeriod(night, morning)).toBe(false)
  })

  it('returns false when both slots are on the same day', () => {
    const a = makeSlot('Monday', 1200, 1320)
    const b = makeSlot('Monday', 420, 510)

    expect(violatesRestPeriod(a, b)).toBe(false)
  })
})

// --- Class detection

describe('hasConflict', () => {
  it('returns true when slots overlap partially', () => {
    const a = makeSlot('Monday', 540, 660) // 9:00 → 11:00
    const b = makeSlot('Monday', 600, 720) // 10:00 → 12:00

    expect(hasConflict(a, b)).toBe(true)
  })

  it('returns true when one slot contains the other', () => {
    const a = makeSlot('Monday', 540, 720) // 9:00 → 12:00
    const b = makeSlot('Monday', 600, 660) // 10:00 → 11:00

    expect(hasConflict(a, b)).toBe(true)
  })

  it('returns false when slots are contiguous (no overlap)', () => {
    const a = makeSlot('Monday', 540, 630) // 9:00 → 10:30
    const b = makeSlot('Monday', 630, 720) // 10:30 → 12:00

    expect(hasConflict(a, b)).toBe(false)
  })

  it('returns false when slots are on different days', () => {
    const a = makeSlot('Monday', 540, 660)
    const b = makeSlot('Tuesday', 540, 660)

    expect(hasConflict(a, b)).toBe(false)
  })

  it('returns false when slots do not overlap', () => {
    const a = makeSlot('Monday', 540, 630) // 9:00 → 10:30
    const b = makeSlot('Monday', 720, 810) // 12:00 → 13:30

    expect(hasConflict(a, b)).toBe(false)
  })
})
