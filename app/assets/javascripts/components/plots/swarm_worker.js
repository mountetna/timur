import { createScale } from '../../utils/d3_scale'
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force'

const groupBy = (list, keyGetter) => {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

module.exports = function (self) {
  self.addEventListener('message', ev => {
    const {
      data,
      datumKey,
      groupByKey,
      plottingAreaWidth,
      plottingAreaHeight,
      xmin,
      xmax,
      yTicks,
      yValues,
      radius = 2
    } = ev.data

    const dataSeriesMap = groupBy(data, item => item[groupByKey]) // Map ( yValue -> [ data ] )
    const yScale = createScale(yTicks, [plottingAreaHeight, 0])
    const xScale = createScale([xmin, xmax], [0, plottingAreaWidth])

    const swarms = yValues.reduce((acc, key) => {
      // simulation for each series to find position of points
      let seriesData = dataSeriesMap.get(key)
      const simulation = forceSimulation(seriesData)
        .force("x",
          forceX(d => xScale(d[datumKey])).strength(1)
        )
        .force("y",
          forceY(yScale(key))
        )
        .force("collide", forceCollide(1.5))
        .stop();
      for (var i = 0; i < seriesData.length; ++i) simulation.tick();

      //update y value if outside the y boundaries
      const yBot = yScale(key) + (yScale.rangeBand() / 2) - radius
      const yTop = yScale(key) - (yScale.rangeBand() / 2) + radius
      const swarm = seriesData.map(node => {
        let y = node.y
        if (y > yBot) {
          y = yBot
        }
        if (y < yTop) {
          y = yTop
        }
        return { ...node, y, radius }
      })
      return [...acc, ...swarm]
    }, [])

    //return list of nodes after simulation
    self.postMessage(swarms)
  });
};