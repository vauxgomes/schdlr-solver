import type { Day, Program } from '../types/domain'
import { ScheduleGraph } from '../types/graph'
import { Slot } from './../types/domain'
import { hasConflict } from './utils'

export function programsToGraph(programs: Program[]): ScheduleGraph {
  const graph = new ScheduleGraph()

  // Program.cohorts.slots flatten by day for efficient conflict detection
  const slotsPerDay: Record<Day, Slot[]> = {} as Record<Day, Slot[]>

  for (const program of programs) {
    for (const cohort of program.cohorts) {
      for (const slot of cohort.slots) {
        if (!slotsPerDay[slot.day]) slotsPerDay[slot.day] = []
        slotsPerDay[slot.day].push(slot)

        // Add vertex for each slot
        graph.addVertex({
          id: slot.id,
          cohortId: cohort.id,
          slotId: slot.id,
          name: `${slot.start}-${slot.end}`,
        })
      }
    }
  }

  // Add edges for conflicting slots by day
  for (const day in slotsPerDay) {
    const slots = slotsPerDay[day as Day]

    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (hasConflict(slots[i]!, slots[j]!)) {
          graph.addEdge(slots[i]!.id, slots[j]!.id, 'conflict')
        }
      }
    }
  }

  return graph
}
