import { Vector } from './types'

namespace Vec {
  export function equals(a: Vector, b: Vector) {
    return a.x === b.x && a.y === b.y
  }

  export function euclideanDistance(a: Vector, b: Vector): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  export function manhattanDistance(a: Vector, b: Vector): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
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

  export function pointAsFarAsPossible(size: Vector, point: Vector): Vector {
    const corners = [
      { x: 0, y: 0 },
      { x: size.x - 1, y: 0 },
      { x: size.x - 1, y: size.y - 1 },
      { x: 0, y: size.y - 1 }
    ]

    let fatherst = corners[0]
    let dist = euclideanDistance(fatherst, point)
    for (let i = 1; i < corners.length; i++) {
      const candidate = corners[i]
      const candidateDist = euclideanDistance(candidate, point)
      if (candidateDist > dist) {
        dist = candidateDist
        fatherst = candidate
      }
    }
    return fatherst
  }
}

export default Vec
