import { createInitialContext } from './context'
import { FRAME_MS, SIZE } from './const'
import { draw, drawFound } from './draw'
import { pointEquals, wait, nextPoint, exitHandler } from './util'

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

async function start() {
  let ctx = createInitialContext({ x: SIZE, y: SIZE })
  let best = ctx.grid
    .flat()
    .reduce((best, curr) => (best.probability > curr.probability ? best : curr))

  console.clear()

  while (true) {
    draw(ctx)
    await wait(FRAME_MS)
    const found = ctx.check(ctx.currentPosition)

    if (found) {
      drawFound(ctx)
      await wait(500)
      ctx = createInitialContext({ x: SIZE, y: SIZE })
      best = ctx.grid
        .flat()
        .reduce((best, curr) =>
          best.probability > curr.probability ? best : curr
        )

      continue
    }

    const newAdjacents = ctx.adjacents(ctx.currentPosition)

    best = pointEquals(ctx.currentPosition, best)
      ? ctx.grid
          .flat()
          .reduce((best, curr) =>
            best.probability > curr.probability ? best : curr
          )
      : best

    if (newAdjacents.length === 0) {
      const next = nextPoint(ctx.currentPosition, best)
      ctx.currentPosition = next
      continue
    }

    const bestAdjacent = newAdjacents.reduce((best, curr) =>
      best.probability > curr.probability ? best : curr
    )

    if (best.probability / bestAdjacent.probability > 2) {
      ctx.currentPosition = nextPoint(ctx.currentPosition, best)
    } else {
      ctx.currentPosition = bestAdjacent
    }
  }
}

start()
