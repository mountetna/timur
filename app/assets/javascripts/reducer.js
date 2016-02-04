
plotReducer = function(state, action) {
  if (!state) state = [];
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CREATE_NEW_PLOT':
      return state.concat( {
        plot_id: action.plot_id,
        type: action.plot_type
      }
      );
    case 'UPDATE_REQUESTED_SERIES':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            requested_series: action.requested_series 
          })
        }
        return plot;
      });
    case 'UPDATE_REQUESTED_MAPPINGS':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            requested_mappings: action.requested_mappings 
          })
        }
        return plot;
      });
    case 'REQUEST_PLOT_DATA':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          // make a data request based on this plot contents, what
          // is it?
        }
      });
      return state;
    case 'REQUEST_PLOT_DATA_SUCCESS':
      return state;
    case 'REQUEST_PLOT_DATA_FAILURE':
      return state;
    default:
      return state;
  }
}
