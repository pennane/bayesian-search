import { showCursor } from './draw'
import type { TextSetting } from './types'

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const PROBABILITY_CEIL_COLORS: [number, TextSetting[]][] = [
  [0.00001, ['hidden', 'bgBlack']],
  [0.0001, ['gray', 'bgBlack']],
  [0.001, ['gray', 'bgBlack', 'bold']],
  [0.005, ['green', 'bgBlack']],
  [0.01, ['greenBright', 'bgBlack', 'bold']],
  [0.05, ['yellow', 'bgBlack']],
  [0.1, ['yellowBright', 'bgBlack', 'bold']],
  [0.5, ['redBright', 'bgBlack']],
  [1, ['redBright', 'bgRed', 'bold']]
]

export function probabilityColor(p: number) {
  if (p < 0 || p > 1) throw new Error('Invalid probability: ' + p)

  const entry = PROBABILITY_CEIL_COLORS.find(([ceil]) => p < ceil)

  if (entry) {
    return entry[1]
  }

  return PROBABILITY_CEIL_COLORS.at(-1)![1]
}

export function exitHandler(
  options: { cleanup?: boolean; exit?: boolean },
  exitCode: number
) {
  if (options.cleanup) process.stdout.write(showCursor())
  if (exitCode != null) console.log(exitCode)
  if (options.exit) process.exit()
}
