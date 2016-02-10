var plotActions = {
  addPlotData: function(plot_id, plot_json) {
    return {
      type: 'ADD_PLOT_DATA',
      plot_id: plot_id,
      series: plot_json.series
    }
  },
  cancelPlotConfig: function(plot_id) {
    return {
      type: 'CANCEL_PLOT_CONFIG',
      plot_id: plot_id
    }
  },
  requestPlotData: function(plot, success, failure) {
    var self = this;
    var request = {
      series: plot.requested_series,
      mappings: plot.requested_mappings
    };
    return function(dispatch) {
      $.ajax({
        url: Routes.plot_json_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(plot_json) {
          dispatch(plotActions.addPlotData(plot.plot_id, plot_json))
          success(plot_json);
        },
        error: function(error) {
        }
      })
    }
  },
  closePlot: function(plot_id) {
    return {
      type: 'CLOSE_PLOT',
      plot_id: plot_id
    }
  }
}

module.exports = plotActions;
