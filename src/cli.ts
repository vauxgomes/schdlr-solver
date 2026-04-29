#!/usr/bin/env node
import { Command } from 'commander'

import { describeSchedule, loadSchedule } from './io/reader'

const cli = new Command()

cli
  .name('schdlr-solver')
  .description('Solve academic timetabling problems using graph coloring')
  .version('1.0.0')
  .requiredOption('-f, --file <path>', 'path to the input JSON file')
  .option('-v, --verbose', 'print detailed schedule description', false)
  .action(async (options: { file: string; verbose: boolean }) => {
    const programs = await loadSchedule(options.file)
    console.log('Schedule loaded successfully!')

    if (options.verbose) {
      console.log('\n--\nSchedule details:')
      describeSchedule(programs)
    }
  })

cli.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
