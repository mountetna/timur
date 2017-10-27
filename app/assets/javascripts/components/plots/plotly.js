import createPlotlyComponent from 'react-plotlyjs';
import  Plotly from 'plotly.js/lib/core';

// require plots that can be displayed with plotly component
Plotly.register([
  require('plotly.js/lib/scatter')
]);

export default createPlotlyComponent(Plotly);