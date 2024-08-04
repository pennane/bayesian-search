import {
  ADJACENT_DELTAS,
  INITIAL_EXPECTATION_RANGE_DIVIDER,
  INITIAL_EXPECTATION_WEIGHT,
  PROBABILITY_TO_FIND,
  SIZE
} from './const'
import { Cell, Vec } from './types'
import { pointEquals } from './util'

type ContextParams = {
  rows: Cell[][]
  actual: Vec
  startingPosition: Vec
}

export class Context {
  grid: (Cell & Vec)[][]
  actualGoal: Cell & Vec
  currentPosition: Vec

  constructor({ rows, actual, startingPosition }: ContextParams) {
    this.grid = rows.map((row, y) => row.map((cell, x) => ({ ...cell, x, y })))
    this.actualGoal = this.at(actual)
    this.currentPosition = startingPosition
  }

  at<T extends { x: number; y: number }>(point: T) {
    return this.grid[point.y][point.x]
  }

  check(point: Vec): boolean {
    const cell = this.at(point)
    const isGoal = pointEquals(this.actualGoal, cell)

    if (isGoal && Math.random() < cell.probabilityToFind) {
      return true
    }

    cell.visitations += 1

    // Calculate the new total probability with the adjusted probability only for the checked cell
    const newTotalProbability = this.grid.reduce((sum, row) => {
      return (
        sum +
        row.reduce((rowSum, c) => {
          let adjustedProbability = c.probability
          if (c.x === point.x && c.y === point.y) {
            adjustedProbability *= Math.pow(
              1 - c.probabilityToFind,
              c.visitations
            )
          }
          return rowSum + adjustedProbability
        }, 0)
      )
    }, 0)

    // Update the probabilities of each cell
    this.grid.forEach((row) => {
      row.forEach((c) => {
        let adjustedProbability = c.probability
        if (c.x === point.x && c.y === point.y) {
          adjustedProbability *= Math.pow(
            1 - c.probabilityToFind,
            c.visitations
          )
          c.probability =
            (adjustedProbability * (1 - c.probabilityToFind)) /
            newTotalProbability
        } else {
          c.probability = adjustedProbability / newTotalProbability
        }
      })
    })

    return false
  }

  adjacents(point: Vec) {
    const adjacents: (Cell & Vec)[] = []

    for (const dir of ADJACENT_DELTAS) {
      const newX = point.x + dir.x
      const newY = point.y + dir.y

      if (
        newX >= 0 &&
        newX < this.grid[0].length &&
        newY >= 0 &&
        newY < this.grid.length
      ) {
        adjacents.push(this.at({ x: newX, y: newY }))
      }
    }

    return adjacents
  }
}

export function createInitialContext(size: Vec): Context {
  const rows = size.x
  const cols = size.y

  const startingPosition = {
    y: Math.floor(Math.random() * rows),
    x: Math.floor(Math.random() * cols)
  }

  const actual = {
    x: Math.floor(Math.random() * SIZE),
    y: Math.floor(Math.random() * SIZE)
  }

  const expectationRange = Math.round(SIZE / INITIAL_EXPECTATION_RANGE_DIVIDER)

  const expectedActual = {
    x: Math.floor(
      actual.x + (expectationRange * Math.random() - 0.5 * expectationRange)
    ),
    y: Math.floor(
      actual.y + (expectationRange * Math.random() - 0.5 * expectationRange)
    )
  }

  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      probability: 0, // We'll set probabilities in the next step
      visitations: 0,
      probabilityToFind: PROBABILITY_TO_FIND
    }))
  )

  let totalProbability = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const distance =
        Math.abs(i - expectedActual.y) + Math.abs(j - expectedActual.x)

      const probability =
        1_000_000 / Math.exp(INITIAL_EXPECTATION_WEIGHT * (distance + 1))

      grid[i][j].probability = probability
      totalProbability += probability
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].probability /= totalProbability
    }
  }

  return new Context({ rows: grid, actual, startingPosition })
}
