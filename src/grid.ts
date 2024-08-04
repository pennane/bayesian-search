import { ADJACENT_DELTAS } from './const'
import { Cell, Vector, Grid } from './types'

function at(grid: Grid, point: Vector) {
  return grid[point.y][point.x]
}

function adjacents(grid: Grid, point: Vector) {
  const adjacents: (Cell & Vector)[] = []

  for (const dir of ADJACENT_DELTAS) {
    const newX = point.x + dir.x
    const newY = point.y + dir.y

    if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length) {
      adjacents.push(at(grid, { x: newX, y: newY }))
    }
  }

  return adjacents
}

function findBest(grid: Grid) {
  return grid
    .flat()
    .reduce((best, curr) => (best.probability > curr.probability ? best : curr))
}

const Grid = { at, adjacents, findBest }

export default Grid
