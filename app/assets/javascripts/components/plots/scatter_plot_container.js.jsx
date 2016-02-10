var addPlotData = function(plot_id, plot_json) {
  return {
    type: 'ADD_PLOT_DATA',
    plot_id: plot_id,
    series: plot_json.series,
    mappings: plot_json.mappings,
    data: plot_json.data
  }
}

var cancelPlotConfig = function(plot_id) {
  return {
    type: 'CANCEL_PLOT_CONFIG',
    plot_id: plot_id
  }
}

var requestPlotData = function(plot, success, failure) {
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
        dispatch(addPlotData(plot.plot_id, plot_json))
        success(plot_json);
      },
      error: function(error) {
      }
    })
  }
}

var closePlot = function(plot_id) {
  return {
    type: 'CLOSE_PLOT',
    plot_id: plot_id
  }
}

ScatterPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  render: function() {
    var self = this;

    var all_series = [];
    var plot = this.props.plot;
    
    if (plot.series) {
      all_series = plot.series.map(function(series, i) {
        var series_def = self.props.saves.series[series.key];
        var matrix = new Matrix( series.matrix.rows, series.matrix.row_names, series.matrix.col_names );
        return {
          matrix: matrix.col_filter(function(col) {
            return col.every(function(v) { return v != undefined });
          }),
          name: series_def.name,
          color: series_def.color
        };
      });
      console.log(all_series);
    }

    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        XY Scatter
      </Header>
      {
        this.state.mode == 'edit' ?
        <PlotConfig
          plot={plot}
          series_limits="any"
          mappings_limits={ [ "X", "Y" ] }
          series={ this.props.saves.series }
          mappings={ $.extend(this.props.saves.mappings, this.props.default_mappings) }/>
        :
        null
      }
      <ScatterPlot data_key={ plot.data_key } data={ all_series } plot={{
          width: 900,
          height: 300,
          margin: {
            left: 70,
            top: 5,
            bottom: 40,
            right: 200
          }
        }}/>
    </div>;
  },
  header_handler: function(action) {
    var self = this;
    switch(action) {
      case 'cancel':
        var store = this.context.store;
        this.setState({mode: 'plot'});
        store.dispatch(cancelPlotConfig(this.props.plot.plot_id));
        break;
      case 'approve':
        var store = this.context.store;
        
        if (this.props.plot.requested_mappings.length != 2) {
          alert('You need to have an X and a Y mapping value.');
          return
        }

        if (this.props.plot.requested_series.length == 0) {
          alert('You need to select at least one series to plot.');
          return
        }

        this.setState({mode: 'submit'});
        store.dispatch(requestPlotData(this.props.plot, function(plot_json) {
          self.setState({ mode: 'plot' });
        }));
        break;
      case 'edit':
        this.setState({mode: 'edit'});
        break;
      case 'close':
        var store = this.context.store;
        store.dispatch(closePlot(this.props.plot.plot_id));
        break;
    }
  },
});
ScatterPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ScatterPlotContainer;
