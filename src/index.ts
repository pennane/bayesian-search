import { MOVE_DELAY_MS, GRID_SIZE, FOUND_GOAL_MESSAGE_MS } from './const'
import { draw, drawFound } from './draw'
import { exitHandler, wait } from './util'
import BayesianSearch from './bayesianSearch'
import Vec from './vec'
import Grid from './grid'

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

async function start() {
  console.clear()

  let ctx = BayesianSearch.createInitial({ x: GRID_SIZE, y: GRID_SIZE })

  while (true) {
    draw(ctx)
    MOVE_DELAY_MS > 0 && (await wait(MOVE_DELAY_MS))

    const goalFound = ctx.check(ctx.position)

    if (goalFound) {
      drawFound(ctx)
      FOUND_GOAL_MESSAGE_MS > 0 && (await wait(FOUND_GOAL_MESSAGE_MS))
      ctx = BayesianSearch.createInitial({ x: GRID_SIZE, y: GRID_SIZE })
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

    if (ctx.best.probability / bestAdjacent.probability > 1.5) {
      ctx.position = Vec.nextPoint(ctx.position, ctx.best)
    } else {
      ctx.position = bestAdjacent
    }
  }
}

start()
