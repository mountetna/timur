import React from 'react';
import { connect } from 'react-redux';
import PlotlyComponent from './plotly';
import { selectPoints } from '../../actions/plot_actions';

let Scatter = ({ plot, consignment, selectPoints }) => {
  const config =  {
    showLink: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines']
  };

  let layout;
  try {
    layout = {
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
  } catch (e) {
    console.log(e);
  }

  let data;
  try {
    data = plot.data.map(series => {
      const x = series.x || series.manifestSeriesX;
      const y = series.y || series.manifestSeriesY;

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
  } catch (e) {
    console.log(e);
  }

  const onSelected = (selectedData) => selectPoints(selectedData.points.map(point => point.id));

  return <PlotlyComponent data={data} layout={layout} config={config} onSelected={onSelected} />;
};

export default connect(null, { selectPoints })(Scatter);