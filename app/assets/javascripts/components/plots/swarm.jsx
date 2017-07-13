import React, { Component } from 'react'
import work from 'webworkify'
import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import { createScale } from '../../utils/d3_scale'

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

class SwarmPlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      swarmPoints: []
    }

    this.worker = work(require("./swarm_worker.js"));
    this.worker.addEventListener('message', (m) => {
      this.setState({swarmPoints: m.data});
    })

    if (props.data[0]) {
      this.worker.postMessage(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.worker.postMessage(nextProps)
  }

  componentWillUnmount() {
    this.worker.terminate()
  }

  render() {
    const {
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
      datumKey = 'value',
      groupByKey = 'id',
      legendKey = 'category',
      legend = [],
      xmin = 0,
      xmax,
      xLabel = '',
      yLabel = ''
    } = this.props

    const plottingAreaWidth = width - left - right
    const plottingAreaHeight = height - top - bottom

    const dataSeriesMap = groupBy(data, item => item[groupByKey])
    const keys = Array.from(dataSeriesMap.keys()).sort().reverse()


    const swarmKeys = data
      .map(row => row[groupByKey])
      .filter((v, i, s) => s.indexOf(v) === i)
      .sort()
      .reverse()


    const yTicks = [...swarmKeys, '']
    const yScale = createScale(yTicks, [plottingAreaHeight, 0])

    if (typeof xmax === 'undefined' || typeof xmin === 'undefined') {
      var allValues = data.map(datum => datum[datumKey]).reduce((acc, curr) => [...acc, ...curr], [])
    }

    const max = typeof xmax !== 'undefined' ? xmax : d3.max(allValues)
    const min = typeof xmin !== 'undefined' ? xmin : d3.min(allValues)
    const xScale = createScale([min, max], [0, plottingAreaWidth])

    const colorMap = legend.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.category]: curr.color
      }
    }, {})

    const swarms = this.state.swarmPoints.map(({ cx, cy, color }, i) => {
      return (
        <circle key={i}
                cx={cx}
                cy={cy}
                r={2}
                style={{fill: color}}
        />
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
          <Legend
            x={plottingAreaWidth + 20}
            y={0}
            series={legend.map((cat) => ({...cat, name: cat.label || cat.category}))}
          />
          { swarms }
        </PlotCanvas>
      </svg>
    )
  }
}

export default SwarmPlot