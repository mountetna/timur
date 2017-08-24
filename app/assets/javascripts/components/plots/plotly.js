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
      plotly.data = plotly.data.map(d => ({
        ...d,
        x: consignment[d.manifestSeriesX] ? consignment[d.manifestSeriesX].values : [],
        y: consignment[d.manifestSeriesY] ? consignment[d.manifestSeriesY].values : []
      }));
      return plotly;
    default:
      return plot;
  }
}

export default ({ plot, consignment }) => <PlotlyComponent { ...toPlotlyProps(plot, consignment) }/>