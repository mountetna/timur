import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotlyjs';
import  Plotly from 'plotly.js/lib/core'
Plotly.register([
  require('plotly.js/lib/scatter')
]);
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class Plotter extends Component {
  render() {
    console.log(this.props.data)
    let data = [
      {
        type: 'scatter',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
        x: [1, 2, 3],     // more about "x": #scatter-x
        y: [6, 2, 3],     // #scatter-y
        mode: 'markers',
        marker: {         // marker is an object, valid marker keys: #scatter-marker
          color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
        }
      },
    ];
    let layout = {                     // all "layout" attributes: #layout
      title: 'simple example',  // more about "layout.title": #layout-title
      xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
        title: 'time'         // more about "layout.xaxis.title": #layout-xaxis-title
      }
    };
    let config = {
      showLink: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['sendDataToCloud','lasso2d', 'toggleSpikelines']
    };
    return (
      <div>
        <h1>Hello World!</h1>
        <PlotlyComponent className="whatever" data={data} layout={layout} config={config}/>
      </div>
    )
  }
}