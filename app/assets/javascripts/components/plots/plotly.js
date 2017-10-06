import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotlyjs'
import  Plotly from 'plotly.js/lib/core'

// require plots that can be displayed with plotly component
Plotly.register([
  require('plotly.js/lib/scatter')
])
const PlotlyComponent = createPlotlyComponent(Plotly)

// create plotly props from plot configuration and data references to consignment
const toPlotlyProps = (plot, consignment) => {
  let plotType = plot ? plot.plot_type || plot.plotType :  '';
  switch (plotType) {
    case 'scatter':
      let plotly = plot.configuration ? { ...plot.configuration } : { ...plot };

      // replace insert x and y data from the consignment
      plotly.data = plotly.data.map(d => {
        let ids = []
        if (consignment[d.manifestSeriesY]) {
          ids = consignment[d.manifestSeriesY].labels
        } else if (consignment[d.manifestSeriesX]) {
          ids = consignment[d.manifestSeriesX].labels
        }

        return {
          ...d,
          x: consignment[d.manifestSeriesX] ? consignment[d.manifestSeriesX].values : [],
          y: consignment[d.manifestSeriesY] ? consignment[d.manifestSeriesY].values : [],
          ids,
        }
      });

      return plotly;
    default:
      return plot;
  }
}

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
      <PlotlyComponent { ...toPlotlyProps(plot, consignment || {}) } onSelected={onSelected}/>
    )
  }
}

export default Plot