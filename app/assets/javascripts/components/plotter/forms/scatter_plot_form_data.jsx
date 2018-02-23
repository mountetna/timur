export const scatterPlotFormData = (series_options)=>{
  return {
    form_headers: {
      xaxis: {
        title: (series_options) ? 'X Axis Title' : '',
        gridcolor: '#bdbdbd',
        showgrid: true,
        showline: true,
        type: 'text',
        value: (series_options) ? ['layout', 'xaxis', 'title'] : ''
      },
      yaxis: {
        title: (series_options) ? 'Y Axis Title' : '',
        gridcolor: '#bdbdbd',
        showgrid: true,
        showline: true,
        type: 'text',
        value: (series_options) ? ['layout', 'yaxis', 'title'] : ''
      },
    },
    series_fields: {
      mode: ['markers', 'lines', 'lines and markers'],
      manifestSeriesX: series_options,
      manifestSeriesY: series_options
    }
  };
};
