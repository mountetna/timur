
var OneDScatterPlotContainer = React.createClass({
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
    }

    return <div className="scatter plot">
      <PlotHeader mode={ this.state.mode } 
        name="1D Scatter"
        plot={ plot }
        newMode={ function(mode) { self.setState({mode: mode}); } }
        onApprove={
          function() {
            if (plot.requested_mappings.length == 0) {
              alert('You need to select a mapping to plot.');
              return false;
            }
            if (plot.requested_series.length == 0) {
              alert('You need to select at least one series to plot.');
              return false;
            }
            return true;
          }
        }
        />
      {
        this.state.mode == 'edit' ?
        <PlotConfig
          plot={plot}
          series_limits="any"
          mappings_limits={ [ "Mapping" ] }
          series={ this.props.saves.series }
          mappings={ $.extend(this.props.saves.mappings, this.props.default_mappings) }/>
        :
        null
      }
      <OneDScatterPlot data_key={ plot.data_key } data={ all_series } plot={{
          width: 900,
          height: 300,
          margin: {
            left: 20,
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
OneDScatterPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = OneDScatterPlotContainer;
