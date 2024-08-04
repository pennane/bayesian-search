import { ADJACENT_OFFSETS } from './const'
import { Cell, Vector, Grid } from './types'

namespace Grid {
  export function at(grid: Grid, point: Vector) {
    return grid[point.y][point.x]
  }

  export function adjacents(grid: Grid, point: Vector) {
    const adjacents: (Cell & Vector)[] = []

    for (const offset of ADJACENT_OFFSETS) {
      const newX = point.x + offset.x
      const newY = point.y + offset.y

      if (
        newX >= 0 &&
        newX < grid[0].length &&
        newY >= 0 &&
        newY < grid.length
      ) {
        adjacents.push(at(grid, { x: newX, y: newY }))
      }
    }

    return adjacents
  }

  export function findBest(grid: Grid) {
    return grid
      .flat()
      .reduce((best, curr) =>
        best.probability > curr.probability ? best : curr
      )
  }

  export function positionNearEdge(size: number): number {
    const nearEdgeRange = size * 0.2

    return Math.random() < 0.5
      ? Math.floor(Math.random() * nearEdgeRange) + 1
      : size - 1 - Math.floor(Math.random() * nearEdgeRange) - 1
  }

  export function positionNearCentre(size: number): number {
    const centreRange = size * 0.3
    const centre = size / 2

    return Math.random() < 0.5
      ? Math.floor(centre - Math.random() * centreRange)
      : Math.floor(centre + Math.random() * centreRange)
  }
}

export default Grid
