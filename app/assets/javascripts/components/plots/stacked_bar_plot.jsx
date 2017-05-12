import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import Legend from './legend'
import { createScale } from '../../utils/d3_scale'

const StackedBar = ({ plotHeight, properties, datum, xScale, yScale, datumKey }) => {
  const bars = properties.map(({ field, color }, i, arr) => {
    const bottom = arr.slice(0, i).reduce((acc, curr) => {
      return acc + datum[curr.field]
    }, 0)
    const top = bottom + datum[field]
    const height = bottom === 0 ? plotHeight - yScale(top) : yScale(bottom) - yScale(top)

    return (
      <rect key={i}
        style={{fill: color}}
        width={xScale.rangeBand()}
        height={height}
        x={xScale(datum[datumKey])}
        y={yScale(top)}
      />
    )
  })

  return <g>{bars}</g>
}

const StackedBars = ({ datumKey, data, properties, plotHeight, xScale, yScale }) => {
  const bars = data.map((datum, i) => {
    const props = {datum, properties, xScale, yScale, datumKey }
    return <g key={i}><StackedBar {...{...props, plotHeight}} /></g>
  })

  return <g>{bars}</g>
}

const StackedBarPlot = ({
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
  ymin = 0,
  ymax = 1,
  data,
  datumKey,
  properties
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  const yScale = createScale([ymin, ymax], [plottingAreaHeight, 0])

  const xTicks = data.map(datum => datum[datumKey])
  const xScale = createScale(xTicks, [0, plottingAreaWidth])

  const barsProps = { datumKey, data, properties, xScale, yScale, plotHeight: plottingAreaHeight }
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
        <YAxis
          scale={yScale}
          ymin={ymin}
          ymax={ymax}
          tick_width={5}
        />
        <Legend
          x={width - right - 30}
          y={0}
          series={properties.map((prop) => ({...prop, name: prop.label || prop.field}))}
        />
        <StackedBars {...barsProps} />
      </PlotCanvas>
    </svg>
  )
}

export default StackedBarPlot