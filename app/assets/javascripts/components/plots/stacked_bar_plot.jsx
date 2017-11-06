import React, { Component } from 'react';

import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import PlotCanvas from './plot_canvas';
import Legend from './legend'
import { createScale } from '../../utils/d3_scale'

const StackedBar = ({ plotHeight, legend, datum, xScale, yScale, datumKey }) => {
  const bars = legend.map(({ category, color }, i, arr) => {
    const bottom = arr.slice(0, i).reduce((acc, curr) => {
      return acc + datum[curr.category]
    }, 0)
    const top = bottom + datum[category]
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

const StackedBars = ({ datumKey, data, legend, plotHeight, xScale, yScale }) => {
  const bars = data.map((datum, i) => {
    const props = {datum, legend, xScale, yScale, datumKey }
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
  datumKey = 'id',
  legend
}) => {
  const plottingAreaWidth = width - left - right
  const  plottingAreaHeight = height - top - bottom

  const yScale = createScale([ymin, ymax], [plottingAreaHeight, 0])

  const xTicks = data.map(datum => datum[datumKey])
  const xScale = createScale(xTicks, [0, plottingAreaWidth])

  const barsProps = { datumKey, data, legend, xScale, yScale, plotHeight: plottingAreaHeight }
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
          x={plottingAreaWidth + 20}
          y={0}
          series={legend.map((cat) => ({...cat, name: cat.label || cat.category}))}
        />
        <StackedBars {...barsProps} />
      </PlotCanvas>
    </svg>
  )
}

export default StackedBarPlot
