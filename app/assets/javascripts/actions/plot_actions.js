var plotActions = {
  newPlotId: 0,
  createNewPlot: function(plot_type) {
    console.log("From createNewPlot:");
    console.log(plot_type);
    return {
      type: 'CREATE_NEW_PLOT',
      plot_id: plotActions.newPlotId++,
      plot_type: plot_type.type,
      analysis: plot_type.analysis
    }
  },
  addPlotData: function(plot_id, plot_json) {
    return {
      type: 'ADD_PLOT_DATA',
      plot_id: plot_id,
      series: plot_json.series,
      results: plot_json.pythia_response
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
      mappings: plot.requested_mappings,
      analysis: plot.analysis
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
  },
  updateRequestedSeries: function(plot_id, requested_series) {
    return {
      type: 'UPDATE_REQUESTED_SERIES',
      plot_id: plot_id,
      requested_series: requested_series
    }
  },
  updateRequestedMappings: function(plot_id, requested_mappings) {
    return {
      type: 'UPDATE_REQUESTED_MAPPINGS',
      plot_id: plot_id,
      requested_mappings: requested_mappings
    }
  }
}

module.exports = plotActions;
