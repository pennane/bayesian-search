import {
  INITIAL_EXPECTATION_RANGE_FACTOR,
  GOAL_FIND_PROBABILITY,
  GRID_SIZE,
  INITIAL_PROBABILITY_DISTRIBITION_K,
  INITIAL_PROBABILITY_DISTRIBUTION_X0
} from './const'
import { Cell, SearchCell, Vector } from './types'
import Grid from './grid'
import Vec from './vec'
namespace BayesianSearch {
  export type ContextParams = {
    rows: Cell[][]
    startingPosition: Vector
  }

  export class Context {
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

  export function createInitial(size: Vector): Context {
    const rows = size.x
    const cols = size.y

    const actual = {
      x: Grid.positionNearCentre(rows),
      y: Grid.positionNearCentre(rows)
    }

    const expectationRange = Math.round(
      GRID_SIZE / INITIAL_EXPECTATION_RANGE_FACTOR
    )

    const expectedActual = {
      x: Math.floor(
        actual.x + (expectationRange * Math.random() - 0.5 * expectationRange)
      ),
      y: Math.floor(
        actual.y + (expectationRange * Math.random() - 0.5 * expectationRange)
      )
    }

    const startingPosition = Vec.pointAsFarAsPossible(size, expectedActual)

    const grid: Cell[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        probability: 0,
        visitations: 0,
        probabilityToFind: GOAL_FIND_PROBABILITY,
        isGoal: false
      }))
    )

    let totalProbability = 0

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const distance =
          Math.abs(y - expectedActual.y) + Math.abs(x - expectedActual.x)

        const probability =
          1 /
          (1 +
            Math.exp(
              INITIAL_PROBABILITY_DISTRIBITION_K *
                (distance - INITIAL_PROBABILITY_DISTRIBUTION_X0)
            ))

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

    return new Context({ rows: grid, startingPosition })
  }
}

export default BayesianSearch
