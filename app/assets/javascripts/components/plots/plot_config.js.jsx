/*
 * State for plots:
 * {
 *  id: a number,
 *  type: classname of the plot (ScatterPlot, etc.)
 *
 *  requested_series: the list of series that this plot would like to display
 *  requested_mappings: the list of mappings that this plot would like to display
 *
 *  series: the list of series this plot displays
 *  mappings: the list of mappings this plot displays
 *  data: data to render for this plot, probably:
 *    [
 *      {
 *        series: name,
 *        matrix: samples x mappings
 *      }
 *    ]
 * }
 */

updateRequestedSeries = function(plot_id, requested_series) {
  return {
    type: 'UPDATE_REQUESTED_SERIES',
    plot_id: plot_id,
    requested_series: requested_series
  }
}

updateRequestedMappings = function(plot_id, requested_mappings) {
  return {
    type: 'UPDATE_REQUESTED_MAPPINGS',
    plot_id: plot_id,
    requested_mappings: requested_mappings
  }
}

PlotConfig = React.createClass({
  render_series: function() {
    var self = this;
    if (!this.state.series.length) return <span className="warning">none added</span>;
    return this.state.series.map(function(series_name) {
      return <div className="selected_series" key={ series_name }>{ self.props.saves.series[series_name].name }</div>;
    })
  },
  render: function() {
    var self = this;
    var store = this.context.store;
    return <div className="configure">
        <ListSelector label="Series" values={ this.props.saves.series }
          onChange={ function(items) {
            store.dispatch(updateRequestedSeries(self.props.plot_id, items));
          } } />
        <ListSelector label="Mappings" values={ this.props.saves.mappings }
          onChange={ function(items) {
            store.dispatch(updateRequestedMappings(self.props.plot_id, items));
          } } />
      </div>
  },
});
PlotConfig.contextTypes = {
  store: React.PropTypes.object
};

module.exports = PlotConfig;
