import fs from 'node:fs'

import type { Readable } from 'stream'
import type { Program } from '../types/domain'

export function loadSchedule(filePath: string): Promise<Program[]> {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' })
  return loadScheduleFromStream(stream)
}

export async function loadScheduleFromStream(stream: Readable): Promise<Program[]> {
  let data = ''

  for await (const chunk of stream) {
    data += chunk
  }

  try {
    return JSON.parse(data) as Program[]
  } catch (error) {
    throw new Error(
      `Failed to parse schedule data: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export function describeSchedule(programs: Program[]): void {
  programs.forEach((program) => {
    console.log(`Program: ${program.name}`)

    program.cohorts.forEach((cohort, i) => {
      console.log(`  ${cohort.name}: ${cohort.slots.length} slots, ${cohort.allocations.length} allocations`)
    })
  })
}
