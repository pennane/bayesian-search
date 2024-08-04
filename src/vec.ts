import { Vector } from './types'

namespace Vec {
  export function equals(a: Vector, b: Vector) {
    return a.x === b.x && a.y === b.y
  }

  export function nextPoint(from: Vector, to: Vector): Vector {
    const dx = to.x - from.x
    const dy = to.y - from.y

    if (Math.abs(dx) > Math.abs(dy)) {
      return { x: from.x + Math.sign(dx), y: from.y }
    } else {
      return { x: from.x, y: from.y + Math.sign(dy) }
    }
  }
}

export default Vec
