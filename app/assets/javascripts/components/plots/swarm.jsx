import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
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

const SwarmPlot = ({
  plot: {
    name,
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
  datumKey = 'tpm_log_2',
  groupByKey = 'hugo_name',
  categories = { something: 'blue' },
  xmin = 0,
  xmax,
  xLabel = '',
  yLabel = ''
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

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


  const swarms = keys.map(key => {
    let seriesData = dataSeriesMap.get(key)

    const simulation = forceSimulation(seriesData)
      .force("x", forceX(function(d) { return xScale(d[datumKey]); }).strength(1))
      .force("y", forceY(yScale(key)))
      .force("collide", forceCollide(2))
      .stop();

    for (var i = 0; i < 120; ++i) simulation.tick();

    const yBot = yScale(key) + (yScale.rangeBand() / 2)
    const yTop = yScale(key) - (yScale.rangeBand() / 2)
    let swarm = seriesData.map((node, i) => {
      let y = node.y
      if (y > yBot) { y = yBot }
      if (y < yTop) { y = yTop }
      return (
        <circle key={i}
          cx={node.x}
          cy={y}
          r={2}
          style={{fill: categories[node.category]}}
        />
      )
    })

    return (
      <g key={key}>
        {swarm}
      </g>
    )
  })

  return (
    <svg
      id={name}
      className='bar_plot'
      width={width}
      height={height}
    >
      <PlotCanvas
        x={left}
        y={top}
        width={plottingAreaWidth}
        height={plottingAreaHeight}
      >
        <YAxis
          scale={yScale}
          ticks={yTicks}
          tick_width={5}
          plotAreaHeight={plottingAreaHeight}
          label={yLabel}
        />
        <XAxis
          scale={xScale}
          xmin={min}
          xmax={max}
          tick_width={5}
          plotAreaHeight={plottingAreaHeight}
          label={xLabel}
        />
        { swarms }
      </PlotCanvas>
    </svg>
  )
}

export default SwarmPlot