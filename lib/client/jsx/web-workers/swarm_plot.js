import { createScale } from '../utils/d3_scale'
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force'

module.exports = function (self) {
  self.addEventListener('message', ev => {
    const {
      data,
      datumKey,
      groupKey,
      plottingAreaWidth,
      plottingAreaHeight,
      xmin,
      xmax,
      yTicks,
      radius = 2
    } = ev.data

    const yScale = createScale(yTicks, [plottingAreaHeight, 0])
    const xScale = createScale([xmin, xmax], [0, plottingAreaWidth])
    const y = yScale(groupKey)

    // simulation for each series to find position of points
    const simulation = forceSimulation(data)
      .force("x",
        forceX(d => xScale(d[datumKey])).strength(1)
      )
      .force("y",
        forceY(y)
      )
      .force("collide", forceCollide(1.5))
      .stop();
    for (var i = 0; i < data.length; ++i) simulation.tick();

    //update y value if outside the y boundaries
    const yBot = y + (yScale.rangeBand() / 2) - radius
    const yTop = y - (yScale.rangeBand() / 2) + radius
    const swarm = data.map(node => {
      if (node.y > yBot) {
        node.y = yBot
      }
      if (node.y < yTop) {
        node.y = yTop
      }
      return { ...node, radius }
    })

    self.postMessage({swarm})
  })
}
