import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotlyjs'
import  Plotly from 'plotly.js/lib/core'

// require plots that can be displayed with plotly component
Plotly.register([
  require('plotly.js/lib/scatter')
])
const PlotlyComponent = createPlotlyComponent(Plotly)

class Plot extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.plot != nextProps.plot ||
      (!this.props.consignment && nextProps.consignment)
    )
  }

  render() {
    const { plot, consignment, onSelected } = this.props
    return (
      <PlotlyComponent { ...plot.toPlotly(consignment) } onSelected={onSelected}/>
    )
  }
}

export default Plot