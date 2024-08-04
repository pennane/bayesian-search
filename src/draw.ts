import { styleText } from 'node:util'
import Grid from './grid'
import Vec from './vec'
import Context from './context'
import { probabilityColor, PROBABILITY_CEIL_COLORS } from './util'

function moveTo(x: number, y: number): string {
  return `\x1b[${y + 1};${x + 1}H`
}

function hideCursor(): string {
  return '\x1b[?25l'
}

export function showCursor(): string {
  return '\x1b[?25h'
}

export function draw(ctx: Context.BayesianSearch) {
  process.stdout.write(hideCursor())

  process.stdout.write(moveTo(2, 0))
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
            ...(Grid.at(ctx.grid, { x, y }).isGoal
              ? ['bgMagenta' as const]
              : Vec.equals({ x, y }, ctx.position)
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

export function drawFound(ctx: Context.BayesianSearch) {
  const text = styleText(['redBright', 'bgBlack'], 'Found it!')
  const width = ctx.grid[0].length
  const height = ctx.grid.length
  const x = 3 + Math.floor(width / 4 - text.length / 2)
  const y = Math.floor(height / 2)

  for (let i = 0; i < text.length; i++) {
    process.stdout.write(moveTo(x + i, y))
    process.stdout.write(' ')
  }

  process.stdout.write(moveTo(x, y))
  process.stdout.write(text)
  process.stdout.write(hideCursor())
}
