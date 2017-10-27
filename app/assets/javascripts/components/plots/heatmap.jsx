import React from 'react';
import PlotlyComponent from './plotly'

const Heatmap = ({ plot, consignment }) => {
  const config =  {
    showLink: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines']
  };

  const layout = {
    width: plot.layout.width || 1600,
    height: plot.layout.height || 900,
    title: plot.name || '',
    xaxis: {
     ticks: '',
     side: 'top'
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      width: 700,
      height: 700,
      autosize: false
    }
  };

  const data = plot.data.map(({ matrix }) => {
    const { col_names, row_names, rows } = consignment[matrix];

    return {
      x: col_names,
      y: row_names,
      z: rows,
      type: 'heatmap'
    };
  });

  return <PlotlyComponent data={data} layout={layout} config={config} />;
};

export default Heatmap;