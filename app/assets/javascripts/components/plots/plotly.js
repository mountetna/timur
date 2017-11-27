import createPlotlyComponent from 'react-plotlyjs';
import  Plotly from 'plotly.js/lib/core';

// require plots that can be displayed with plotly component
Plotly.register([
  require('plotly.js/lib/scatter'),
  require('plotly.js/lib/heatmap')
]);

export default createPlotlyComponent(Plotly);