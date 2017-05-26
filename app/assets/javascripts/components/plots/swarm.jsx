import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import { createScale } from '../../utils/d3_scale'
import { beeswarm } from 'd3-beeswarm'

const SwarmPlot = ({
  plot: {
    name,
    width = 600,
    height = 500
  },
  margin: {
    top = 0,
    right = 0,
    bottom = 300,
    left = 200
  },
  dataSeries = [{label: 'abugrab', data:[{value: 1, category: 'something'},{value: 3},{value: 4}, {value: 3}]}, {label: 'booboo kitty', data:[{value: 5},{value: 5},{value: 5}]}, {label: '', data: []}],
  datumKey = 'value',
  categories = { something: 'blue' },
  xmin = 0,
  xmax
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  const yTicks = dataSeries.map(s => s.label)
  const yScale = createScale(yTicks, [plottingAreaHeight, 0])

  if (typeof xmax === 'undefined' || typeof xmin === 'undefined') {
    var allValues = dataSeries
      .map(series => series.data
        .map(data => data[datumKey])
      ).
      reduce((acc, curr) => [...acc, ...curr], [])
  }

  const max = typeof xmax !== 'undefined' ? xmax : d3.max(allValues)
  const min = typeof xmin !== 'undefined' ? xmin : d3.min(allValues)
  const xScale = createScale([min, max], [0, plottingAreaWidth])

  const swarms = dataSeries.map(({ label, data }) => {
    const swarm = beeswarm()
      .data(data)
      .distributeOn((d) => {
        return xScale(d[datumKey])
      })
      .radius(2)
      .orientation('horizontal')
      .side('symetric')
      .arrange()
      .map((node, i) => (
        <circle key={i}
           cx={node.x}
           cy={yScale(label) + node.y}
           r={2}
           style={{fill: categories[node.datum.category]}}
        />
      ))

    return (
      <g key={label}>
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
        />
        <XAxis
          scale={xScale}
          xmin={min}
          xmax={max}
          tick_width={5}
          plotAreaHeight={plottingAreaHeight}
        />
        { swarms }
      </PlotCanvas>
    </svg>
  )
}

export default SwarmPlot