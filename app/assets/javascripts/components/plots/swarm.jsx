import React, { Component } from 'react'
import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import * as d3 from "d3"
import { createScale } from '../../utils/d3_scale'
import { createWorker, terminateWorker } from '../../web-workers'

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

    this.setPlotConfig(props)
    this.calculateSwarmPoints(props)
  }

  componentWillReceiveProps(nextProps) {
    // kill potentially busy worker
    this.killWorker()
    // clear the points before recalculating swarm
    this.setState(
      { swarmPoints: [] },
      () => this.calculateSwarmPoints(nextProps)
    )
  }

  componentWillUnmount() {
    this.killWorker()
  }

  killWorker() {
    if (this.worker) {
      terminateWorker(this.worker)
    }
  }

  handleSwarmWorkerMessage(m) {
    // append the swarm points
    this.setState(
      {swarmPoints: [...this.state.swarmPoints, ...m.data.swarm]},
      // kill worker when all points are added
      () => {
        if (this.state.swarmPoints.length === this.props.data) {
          this.killWorker()
        }
      }
    )
  }

  calculateSwarmPoints(props) {
    // kill potentially busy worker
    this.killWorker()

    // set worker
    this.worker = createWorker(require('./../../web-workers/swarm_plot.js'), this.handleSwarmWorkerMessage.bind(this))

    // group data for the y axis - Map (groupKey -> data series)
    const dataSeriesMap = groupBy(props.data, item => item[props.groupByKey])

    // send data to the worker in chunks
    dataSeriesMap.forEach((data, groupKey) => {
      this.worker.postMessage({
        ...this.props,
        data,
        groupKey,
        plottingAreaWidth: this.plottingAreaWidth,
        plottingAreaHeight: this.plottingAreaHeight,
        xmin: this.xmin,
        xmax: this.xmax,
        yTicks: this.yTicks,
        yValues: this.yValues
      })
    })
  }

  setPlotConfig(props) {
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
      datumKey = 'value', // accessor for the x values
      groupByKey = 'id',  // accessor for y values
      legendKey = 'category', // accessor for legend category
      legend = [], // array of objects, e.g. [{ category: 'Bladder', color: 'dodgerblue  }, { category: 'Colorectal', color: 'forestgreen' }]
      xmin = 0,
      xmax
    } = props

    // set legend accessor
    this.legendKey = legendKey

    // set plotting area
    this.plottingAreaWidth = width - left - right
    this.plottingAreaHeight = height - top - bottom

    // set xmin and xmax
    if (typeof xmax === 'undefined' || typeof xmin === 'undefined') {
      var allValues = data.map(datum => datum[datumKey]).reduce((acc, curr) => [...acc, ...curr], [])
    }
    // if undefined in props, set min and max value from data
    this.xmax = typeof xmax !== 'undefined' ? xmax : d3.max(allValues)
    this.xmin = typeof xmin !== 'undefined' ? xmin : d3.min(allValues)
    //set xScale
    this.xScale = createScale([this.xmin, this.xmax], [0, this.plottingAreaWidth])

    // set yTicks
    this.yValues = data
      .map(row => row[groupByKey])
      .filter((v, i, s) => s.indexOf(v) === i)
      .sort()
      .reverse()
    this.yTicks = [...this.yValues, '']

    // set yScale
    this.yScale = createScale(this.yTicks, [this.plottingAreaHeight, 0])

    // set colorMap, categoryNames -> color
    this.colorMap = legend.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.category]: curr.color
      }
    }, {})
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
        left
      },
      legend = [],
      xLabel = '',
      yLabel = '',
    } = this.props

    const swarms = this.state.swarmPoints.map((node, i) => {
      return (
        <circle key={i}
          cx={node.x}
          cy={node.y}
          r={node.radius}
          style={{fill: this.colorMap[node[this.legendKey]] }}
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
          width={this.plottingAreaWidth}
          height={this.plottingAreaHeight}
        >
          <YAxis
            scale={this.yScale}
            ticks={this.yTicks}
            tick_width={5}
            plotAreaHeight={this.plottingAreaHeight}
            label={yLabel}
          />
          <XAxis
            scale={this.xScale}
            xmin={this.xmin}
            xmax={this.xmax}
            tick_width={5}
            plotAreaHeight={this.plottingAreaHeight}
            label={xLabel}
          />
          <Legend
            x={this.plottingAreaWidth + 20}
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