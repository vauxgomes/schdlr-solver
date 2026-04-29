import { describe, it, expect } from 'vitest'
import { programsToGraph } from '../../src/core/generator'
import {
  makeCohort,
  makeProfessor,
  makeAllocation,
  makeSubject,
  makeSlot,
} from '../../src/io/factories'
import type { Cohort, Program } from '../../src/types/domain'

// --- Helpers

function makeProgram(id: number, cohorts: Cohort[]): Program {
  return { id, name: `Program ${id}`, cohorts }
}

const professor = makeProfessor(1, 'Dr. Alice')
const subject = makeSubject(1, 'Networks')
const allocation = makeAllocation(1, professor, subject, 2)

// --- programsToGraph

describe('programsToGraph', () => {
  it('creates a vertex for each slot', () => {
    const cohort = makeCohort(
      1,
      'Networks S1',
      [makeSlot('Monday', 540, 630, 1), makeSlot('Monday', 630, 720, 2)],
      [allocation],
    )

    const graph = programsToGraph([makeProgram(1, [cohort])])

    expect(graph.vertices.size).toBe(2)
    expect(graph.hasVertex(1)).toBe(true)
    expect(graph.hasVertex(2)).toBe(true)
  })

  it('adds an edge between overlapping slots on the same day', () => {
    const cohort = makeCohort(
      1,
      'Networks S1',
      [
        makeSlot('Monday', 540, 660, 1), // 9:00 → 11:00
        makeSlot('Monday', 600, 720, 2), // 10:00 → 12:00 — overlaps with slot 1
      ],
      [allocation],
    )

    const graph = programsToGraph([makeProgram(1, [cohort])])

    expect(graph.hasEdge(1, 2)).toBe(true)
    expect(graph.edges.length).toBe(1)
  })

  it('does not add an edge between contiguous slots', () => {
    const cohort = makeCohort(
      1,
      'Networks S1',
      [
        makeSlot('Monday', 540, 630, 1), // 9:00 → 10:30
        makeSlot('Monday', 630, 720, 2), // 10:30 → 12:00 — contiguous, no overlap
      ],
      [allocation],
    )

    const graph = programsToGraph([makeProgram(1, [cohort])])

    expect(graph.hasEdge(1, 2)).toBe(false)
    expect(graph.edges.length).toBe(0)
  })

  it('does not add an edge between slots on different days', () => {
    const cohort = makeCohort(
      1,
      'Networks S1',
      [makeSlot('Monday', 540, 630, 1), makeSlot('Tuesday', 540, 630, 2)],
      [allocation],
    )

    const graph = programsToGraph([makeProgram(1, [cohort])])

    expect(graph.hasEdge(1, 2)).toBe(false)
    expect(graph.edges.length).toBe(0)
  })

  it('detects conflicts across different cohorts on the same day', () => {
    const cohort1 = makeCohort(1, 'Networks S1', [makeSlot('Monday', 540, 660, 1)], [allocation])
    const cohort2 = makeCohort(2, 'Algorithms S2', [makeSlot('Monday', 600, 720, 2)], [allocation])

    const graph = programsToGraph([makeProgram(1, [cohort1, cohort2])])

    expect(graph.hasEdge(1, 2)).toBe(true)
  })

  it('returns an empty graph for empty programs', () => {
    const graph = programsToGraph([])

    expect(graph.vertices.size).toBe(0)
    expect(graph.edges.length).toBe(0)
  })
})
