export const ADJACENT_OFFSETS = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
]

/**
 * The size of the grid (GRID_SIZE x GRID_SIZE).
 */
export const GRID_SIZE = 24

/**
 * The probability of finding the goal when checking a cell that contains the goal.
 */
export const GOAL_FIND_PROBABILITY = 0.6

/**
 * Determines the initial expectation range relative to the actual goal.
 * A smaller number means the initial expectation is farther from the actual goal,
 * while a number closer to GRID_SIZE means the initial expectation is closer to the actual goal.
 */
export const INITIAL_EXPECTATION_RANGE_FACTOR = 4

/**
 * Determines the dispersion of the initial expectation.
 * A smaller weight means a larger expectation area,
 * while a larger weight means a smaller expectation area.
 */
export const INITIAL_EXPECTATION_DISPERSION = 0.8

/**
 * The number of milliseconds waited between each move in the context.
 */
export const MOVE_DELAY_MS = 25
