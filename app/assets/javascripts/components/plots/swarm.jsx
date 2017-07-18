import React, { Component } from 'react'
import work from 'webworkify'
import PlotCanvas from './plot_canvas'
import YAxis from './yaxis'
import XAxis from './xaxis'
import { createScale } from '../../utils/d3_scale'

class SwarmPlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      swarmPoints: []
    }

    //create web worker and add listener
    this.worker = work(require("./swarm_worker.js"));
    this.worker.addEventListener('message', (m) => {
      this.setState({swarmPoints: m.data});
    })

    this.setPlotConfig(props)

    //send data to worker
    this.postWorkerMessage()
  }

  componentWillReceiveProps(nextProps) {
    this.setPlotConfig(nextProps)
    this.postWorkerMessage()
  }

  componentWillUnmount() {
    this.worker.terminate()
  }

  postWorkerMessage() {
    this.worker.postMessage({
      ...this.props,
      plottingAreaWidth: this.plottingAreaWidth,
      plottingAreaHeight: this.plottingAreaHeight,
      xmin: this.xmin,
      xmax: this.xmax,
      yTicks: this.yTicks,
      yValues: this.yValues
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
      datumKey = 'value', //accessor for the data object
      groupByKey = 'id',
      legendKey = 'category', //accessor for legend category
      legend = [], //array of objects, e.g. [{ category: 'Bladder', color: 'dodgerblue  }, { category: 'Colorectal', color: 'forestgreen' }]
      xmin = 0,
      xmax
    } = props

    //set legend accessor
    this.legendKey = legendKey

    //set plotting area
    this.plottingAreaWidth = width - left - right
    this.plottingAreaHeight = height - top - bottom

    //set xmin and xmax
    if (typeof xmax === 'undefined' || typeof xmin === 'undefined') {
      var allValues = data.map(datum => datum[datumKey]).reduce((acc, curr) => [...acc, ...curr], [])
    }
    //if undefined in props, set min and max value from data
    this.xmax = typeof xmax !== 'undefined' ? xmax : d3.max(allValues)
    this.xmin = typeof xmin !== 'undefined' ? xmin : d3.min(allValues)
    //set xScale
    this.xScale = createScale([this.xmin, this.xmax], [0, this.plottingAreaWidth])

    //set yTicks
    this.yValues = data
      .map(row => row[groupByKey])
      .filter((v, i, s) => s.indexOf(v) === i)
      .sort()
      .reverse()
    this.yTicks = [...this.yValues, '']
    //set yScale
    this.yScale = createScale(this.yTicks, [this.plottingAreaHeight, 0])

    //set colorMap, categoryNames -> color
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