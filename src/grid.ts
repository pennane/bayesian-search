import { ADJACENT_OFFSETS } from './const'
import { Cell, Vector, Grid } from './types'

function at(grid: Grid, point: Vector) {
  return grid[point.y][point.x]
}

function adjacents(grid: Grid, point: Vector) {
  const adjacents: (Cell & Vector)[] = []

  for (const offset of ADJACENT_OFFSETS) {
    const newX = point.x + offset.x
    const newY = point.y + offset.y

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
