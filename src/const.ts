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
 * higher -> more correct expectation
 * lower  -> more faulty expectation
 */
export const INITIAL_EXPECTATION_RANGE_FACTOR = 3

/**
 * How steeply the probabilities transition towards 0
 * higher -> more steep (higher trust in expectation)
 * lower  -> more gradual (lower trust in expectatin)
 */
export const INITIAL_PROBABILITY_DISTRIBITION_K = 2

/**
 * The midpoint of the distribution
 * higher  -> cutoff happens slower (more vague expectation)
 * smaller -> cutoff happens faster (more exact expectation)
 */
export const INITIAL_PROBABILITY_DISTRIBUTION_X0 = 4

/**
 * The number of milliseconds waited between each move in the context.
 */
export const MOVE_DELAY_MS = 30

/**
 * How long the "Found it" message is shown
 */
export const FOUND_GOAL_MESSAGE_MS = 750
