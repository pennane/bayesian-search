import {
  INITIAL_EXPECTATION_RANGE_DIVIDER,
  INITIAL_EXPECTATION_WEIGHT,
  PROBABILITY_TO_FIND,
  SIZE
} from './const'
import { Cell, SearchCell, Vector } from './types'
import Grid from './grid'
import Vec from './vec'
namespace Context {
  export type ContextParams = {
    rows: Cell[][]
    startingPosition: Vector
  }

  export class BayesianSearch {
    grid: SearchCell[][]
    position: Vector
    #best: SearchCell

    constructor({ rows, startingPosition }: ContextParams) {
      this.grid = rows.map((row, y) =>
        row.map((cell, x) => ({ ...cell, x, y }))
      )
      this.position = startingPosition
      this.#best = Grid.findBest(this.grid)
    }

    get best() {
      if (Vec.equals(this.#best, this.position)) {
        this.#best = Grid.findBest(this.grid)
      }
      return this.#best
    }

    check(point: Vector): boolean {
      const cell = Grid.at(this.grid, point)

      if (cell.isGoal && Math.random() < cell.probabilityToFind) {
        return true
      }

      cell.visitations += 1

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

      for (const cell of this.grid.flat()) {
        let adjustedProbability = cell.probability

        if (cell.x === point.x && cell.y === point.y) {
          adjustedProbability *= Math.pow(
            1 - cell.probabilityToFind,
            cell.visitations
          )
          cell.probability =
            (adjustedProbability * (1 - cell.probabilityToFind)) /
            newTotalProbability
        } else {
          cell.probability = adjustedProbability / newTotalProbability
        }
      }

      return false
    }
  }

  export function createInitial(size: Vector): BayesianSearch {
    const rows = size.x
    const cols = size.y

    const startingPosition = {
      y: Math.floor(Math.random() * rows),
      x: Math.floor(Math.random() * cols)
    }

    const actual = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    }

    const expectationRange = Math.round(
      SIZE / INITIAL_EXPECTATION_RANGE_DIVIDER
    )

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
        probability: 0,
        visitations: 0,
        probabilityToFind: PROBABILITY_TO_FIND,
        isGoal: false
      }))
    )

    let totalProbability = 0

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const distance =
          Math.abs(y - expectedActual.y) + Math.abs(x - expectedActual.x)

        const probability =
          1_000_000 / Math.exp(INITIAL_EXPECTATION_WEIGHT * (distance + 1))

        grid[y][x].probability = probability
        totalProbability += probability
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid[y][x].probability /= totalProbability
      }
    }

    grid[actual.y][actual.x].isGoal = true

    return new BayesianSearch({ rows: grid, startingPosition })
  }
}

export default Context
