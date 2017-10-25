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
    return this.props.plot != nextProps.plot || !this.props.consignment && nextProps.consignment
  }

  toPlotly() {
    const { plot, consignment } = this.props;

    const config =  {
      showLink: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines']
    };

    switch(plot.plotType) {
      case 'scatter':
        const layout = {
          width: plot.layout.width || 1600,
          height: plot.layout.height || 900,
          title: plot.name || '',
          xaxis: {
            title: plot.layout.xaxis.title || '',
            showline: true,
            showgrid: plot.layout.xaxis.showgrid || false,
            gridcolor: '#bdbdbd'
          },
          yaxis: {
            title: plot.layout.yaxis.title || '',
            showline: true,
            showgrid: plot.layout.yaxis.showgrid || false,
            gridcolor: '#bdbdbd'
          }
        };


        const data = plot.data.map(series => {
          const x = series.x || series.manifestSeriesX
          const y = series.y || series.manifestSeriesY

          // add ids from y or x labels
          let ids = [];
          if (consignment[y]) {
            ids = consignment[y].labels;
          } else if (consignment[x]) {
            ids = consignment[x].labels;
          }

          return {
            type: 'scatter',
            mode: series.mode || 'markers',
            name: series.name || '',
            // insert x and y data from the consignment
            x: consignment[x] ? consignment[x].values : [],
            y: consignment[y] ? consignment[y].values : [],
            ids,
          };
        });


        return {
          config,
          layout,
          data
        }
      default:
        return {}
    }
  }

  render() {
    return (
      this.props.consignment ? <PlotlyComponent { ...this.toPlotly() } onSelected={this.props.onSelected}/> : <div></div>
    )
  }
}

export default Plot