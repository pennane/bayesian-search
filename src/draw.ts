import { styleText } from 'node:util'

import { probabilityColor, pointEquals, PROBABILITY_CEIL_COLORS } from './util'
import { Context } from './context'

// Helper function to move cursor to a specific position
function moveTo(x: number, y: number): string {
  return `\x1b[${y + 1};${x + 1}H`
}

// Function to hide the cursor
function hideCursor(): string {
  return '\x1b[?25l'
}

export function showCursor(): string {
  return '\x1b[?25h'
}

export function draw(ctx: Context) {
  process.stdout.write(moveTo(0, 0))
  process.stdout.write(hideCursor())

  process.stdout.write(moveTo(1, 0))
  for (const [x] of ctx.grid[0].entries()) {
    process.stdout.write(`${x}`.padEnd(2, ' '))
  }

  for (const [y, row] of ctx.grid.entries()) {
    process.stdout.write(moveTo(0, y + 1))
    process.stdout.write(`${y}`.padEnd(3, ' '))
    for (const [x, cell] of row.entries()) {
      process.stdout.write(moveTo(x * 2 + 2, y + 1))
      process.stdout.write(
        styleText(
          [
            ...probabilityColor(cell.probability),
            ...(pointEquals({ x, y }, ctx.actualGoal)
              ? ['bgMagenta' as const]
              : pointEquals({ x, y }, ctx.currentPosition)
              ? ['bgWhite' as const]
              : [])
          ],
          Math.trunc(cell.probability * 100)
            .toString()
            .padStart(2, '0')
            .slice(0, 2)
        )
      )
    }
  }

  let footerStr = '\n'
  let lastProb = 0
  for (const [prob, effects] of PROBABILITY_CEIL_COLORS) {
    footerStr += styleText(effects.concat('framed'), 'xx')
    footerStr += styleText('white', ': ' + lastProb + ' - ' + prob + '\n')
    lastProb = prob
  }
  process.stdout.write(footerStr)
  process.stdout.write(hideCursor())
}

export function drawFound(ctx: Context) {
  const text = styleText(['redBright', 'bgBlack'], 'Found it!')
  const width = ctx.grid[0].length
  const height = ctx.grid.length
  const x = 3 + Math.floor(width / 4 - text.length / 2)
  const y = Math.floor(height / 2)

  // Clear the area where the text will be displayed
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(moveTo(x + i, y))
    process.stdout.write(' ')
  }

  process.stdout.write(moveTo(x, y))
  process.stdout.write(text)
  process.stdout.write(hideCursor())
}
