import { FRAME_MS, SIZE } from './const'
import { draw, drawFound } from './draw'
import { exitHandler, wait } from './util'
import BayesianSearch from './bayesianSearch'
import Vec from './vec'
import Grid from './grid'

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

async function start() {
  console.clear()

  let ctx = BayesianSearch.createInitial({ x: SIZE, y: SIZE })

  while (true) {
    draw(ctx)
    await wait(FRAME_MS)
    const found = ctx.check(ctx.position)

    if (found) {
      drawFound(ctx)
      await wait(500)
      ctx = BayesianSearch.createInitial({ x: SIZE, y: SIZE })
      continue
    }

    const adjacents = Grid.adjacents(ctx.grid, ctx.position)

    if (adjacents.length === 0) {
      const next = Vec.nextPoint(ctx.position, ctx.best)
      ctx.position = next
      continue
    }

    const bestAdjacent = adjacents.reduce((best, curr) =>
      best.probability > curr.probability ? best : curr
    )

    if (ctx.best.probability / bestAdjacent.probability > 2) {
      ctx.position = Vec.nextPoint(ctx.position, ctx.best)
    } else {
      ctx.position = bestAdjacent
    }
  }
}

start()
