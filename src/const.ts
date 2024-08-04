export const ADJACENT_DELTAS = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
]

export const SIZE = 24
export const PROBABILITY_TO_FIND = 0.5

// How close the initial expectation is to reality
// More better
export const INITIAL_EXPECTATION_RANGE_DIVIDER = 3

// How reliable the expectation is
// More the value, smaller the expectation area
export const INITIAL_EXPECTATION_WEIGHT = 0.4

export const FRAME_MS = 25
