import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import { createScale } from '../../utils/d3_scale'

const Bin = ({ bin, xScale, yScale, plotHeight, color = 'dodgerblue' }) => {
  const width = xScale(bin.dx)
  const padding = .03

  return (
    <rect
      style={{fill: color}}
      width={width - (width * padding)}
      height={plotHeight - yScale(bin.length)}
      x={xScale(bin.x) + (width * padding / 2)}
      y={yScale(bin.y)}
    />
  )
}

const Bins = ({ bins, plotHeight, xScale, yScale, color }) => {
  const bars = bins.map((bin, i) => {
    const props = {bin, xScale, yScale}
    return <g key={i}><Bin {...{...props, plotHeight}} /></g>
  })

  return <g>{bars}</g>
}

const Histogram = ({
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
  data,
  ymin,
  color
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  const bins = d3.layout.histogram()(data)
  const binCounts = bins.map(b => b.length)
  const max = d3.max(binCounts)
  const min = ymin ? ymin : d3.min(binCounts)
  const yScale = createScale([min, max], [plottingAreaHeight, 0])

  const xScale = createScale([d3.min(data), d3.max(data)], [0, plottingAreaWidth])


  const barsProps = { bins, xScale, yScale, plotHeight: plottingAreaHeight, color }
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
          plotAreaWidth={plottingAreaWidth}
          ticks={bins.map(b => b.x)}
        />
        {yScale.ticks() &&
          <YAxis
            num_ticks={max - min}
            scale={yScale}
            ymin={min}
            ymax={max}
            tick_width={5}
          />
        }
        <Bins {...barsProps} />
      </PlotCanvas>
    </svg>
  )
}

export default Histogram

