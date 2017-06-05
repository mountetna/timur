import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import { createScale } from '../../utils/d3_scale'

const Bar = ({ plotHeight, property, datum, xScale, yScale, datumKey }) => (
  <rect
    style={{fill: datum.color}}
    width={xScale.rangeBand()}
    height={plotHeight - yScale(datum[property])}
    x={xScale(datum[datumKey])}
    y={yScale(datum[property])}
  />
)

const Bars = ({ datumKey, property, data, plotHeight, xScale, yScale }) => {
  const bars = data.map((datum, i) => {
    const props = {datum, property, xScale, yScale, datumKey }
    return <g key={i}><Bar {...{...props, plotHeight}} /></g>
  })

  return <g>{bars}</g>
}

const BarGraph = ({
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
  property = 'value',
  datumKey = 'id',
  data,
  ymin = 0,
  ymax,
}) => {

  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  const max = typeof ymax !== 'undefined' ? ymax : d3.max(data.map(d => d[property]))
  const yScale = createScale([ymin, max ], [plottingAreaHeight, 0])

  const xTicks = data.map(datum => datum[datumKey])
  const xScale = createScale(xTicks, [0, plottingAreaWidth])

  const barsProps = { datumKey, property, data, xScale, yScale, plotHeight: plottingAreaHeight }
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
        <XAxis
          y={plottingAreaHeight}
          scale={xScale}
          tick_width={5}
          ticks={xTicks}
          plotAreaWidth={plottingAreaWidth}
        />
        {yScale.ticks() &&
          <YAxis
            scale={yScale}
            ymin={ymin}
            ymax={max}
            tick_width={5}
          />
        }
        <Bars {...barsProps} />
      </PlotCanvas>
    </svg>
  )
}

export default BarGraph