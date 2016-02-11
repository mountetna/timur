HeatmapPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  render: function() {
    var self = this;

    var all_series = [];
    var plot = this.props.plot;
    
    if (plot.data) {
    }

    return <div className="heatmap plot">
      <PlotHeader mode={ this.state.mode } 
        name="Heatmap"
        plot={ plot }
        newMode={ function(mode) { self.setState({mode: mode}); } }
        onApprove={
          function(plot) {
            if (plot.requested_series.length == 0) {
              alert('You need to select at least one series to plot.');
              return false;
            }

            var store = self.context.store;

            store.dispatch(plotActions.updateRequestedMappings(plot.plot_id, Object.keys(self.props.default_mappings)));
            return true;
          }
        }
        />  
      {
        this.state.mode == 'edit' ?
        <PlotConfig
          plot={plot}
          series_limits="any"
          mappings_limits={ [ ] }
          series={ this.props.saves.series }
          mappings={ {} }
          />
        :
        null
      }
      <HeatmapPlot data={ [] } plot={{
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
});
HeatmapPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = HeatmapPlotContainer;
