import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import * as d3 from "d3"
import { createScale } from '../../utils/d3_scale'

const Bin = ({ bin, xScale, yScale, plotHeight, color = 'steelblue', xmin}) => {
  const width = xScale(xmin + bin.dx) - 1
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

const Bins = ({ bins, plotHeight, xScale, yScale, color, xmin }) => {
  const bars = bins.map((bin, i) => {
    const props = {bin, xScale, yScale, color, plotHeight, xmin}
    return <g key={i}><Bin {...props} /></g>
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
  interval,
  yLabel,
  ymax,
  ymin,
  xLabel,
  xmin,
  xmax,
  color
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  let bins = d3.layout.histogram()
  if (typeof xmax !== 'undefined' && typeof xmin !== 'undefined') {
    bins.range([xmin, xmax])
    if (interval) {
      bins.bins(Math.abs(xmax - xmin) / interval)
    }
  }
  bins = bins(data)

  const binCounts = bins.map(b => b.length)
  const yMaxRange = typeof ymax !== 'undefined' ? ymax : d3.max(binCounts)
  const yMinRange = typeof ymin !== 'undefined' ? ymin : d3.min(binCounts)
  const yScale = createScale([yMinRange, yMaxRange], [plottingAreaHeight, 0])

  const xMaxRange = typeof xmax !== 'undefined' ? xmax : d3.max(data)
  const xMinRange = typeof xmin !== 'undefined' ? xmin : d3.min(data)
  const xScale = createScale([xMinRange, xMaxRange], [0, plottingAreaWidth])

  const binsProps = { bins, xScale, yScale, plotHeight: plottingAreaHeight, color, xmin: xMinRange }
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
          xmin={xMinRange}
          xmax={xMaxRange}
          scale={xScale}
          tick_width={5}
          plotAreaWidth={plottingAreaWidth}
          ticks={bins.map(b => b.x)}
          label={xLabel}
        />
        {yScale.ticks() &&
          <YAxis
            scale={yScale}
            ymin={yMinRange}
            ymax={yMaxRange}
            tick_width={5}
            label={yLabel}
          />
        }
        <Bins {...binsProps} />
      </PlotCanvas>
    </svg>
  )
}

export default Histogram

