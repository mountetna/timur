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
  self.addEventListener('message',function (ev){

    const {
      plot: {
        width,
        height
      },
      margin: {
        top,
        right,
        bottom,
        left
      },
      data = [],
      datumKey = 'value',
      groupByKey = 'id',
      legendKey = 'category',
      legend = [],
      xmin = 0,
      xmax,
    } = ev.data

    const plottingAreaWidth = width - left - right
    const plottingAreaHeight = height - top - bottom

    const dataSeriesMap = groupBy(data, item => item[groupByKey])
    const keys = Array.from(dataSeriesMap.keys()).sort().reverse()

    const yTicks = [...keys, '']
    const yScale = createScale(yTicks, [plottingAreaHeight, 0])

    if (typeof xmax === 'undefined' || typeof xmin === 'undefined') {
      var allValues = data.map(datum => datum[datumKey]).reduce((acc, curr) => [...acc, ...curr], [])
    }

    const max = typeof xmax !== 'undefined' ? xmax : d3.max(allValues)
    const min = typeof xmin !== 'undefined' ? xmin : d3.min(allValues)
    const xScale = createScale([min, max], [0, plottingAreaWidth])

    //remove colorMap
    const colorMap = legend.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.category]: curr.color
      }
    }, {})


    const swarms = keys.reduce((acc, key) => {
      let seriesData = dataSeriesMap.get(key)

      const simulation = forceSimulation(seriesData)
        .force("x", forceX(function (d) {
          return xScale(d[datumKey]);
        }).strength(1))
        .force("y", forceY(yScale(key)))
        .force("collide", forceCollide(2))
        .stop();

      for (var i = 0; i < seriesData.length; ++i) simulation.tick();

      const yBot = yScale(key) + (yScale.rangeBand() / 2)
      const yTop = yScale(key) - (yScale.rangeBand() / 2)
      const swarm = seriesData.map((node, i) => {
        let y = node.y
        if (y > yBot) {
          y = yBot
        }
        if (y < yTop) {
          y = yTop
        }

        return { cx: node.x, cy: y, color: colorMap[node[legendKey]] }
      })

      return [...acc, ...swarm]
    }, [])

    self.postMessage(swarms)
  });
};