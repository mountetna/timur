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


PlotConfig = React.createClass({
  render: function() {
    var self = this;
    var store = this.context.store;

    return <div className="configure">
        <ListSelector label="Series" values={ this.props.series }
          limits={ this.props.series_limits }
          currentSelection={ self.props.plot.requested_series }
          onChange={ function(items) {
            store.dispatch(plotActions.updateRequestedSeries(self.props.plot.plot_id, items));
          } } />
        <ListSelector label="Mappings" values={ this.props.mappings }
          limits={ this.props.mappings_limits }
          currentSelection={ self.props.plot.requested_mappings }
          onChange={ function(items) {
            store.dispatch(plotActions.updateRequestedMappings(self.props.plot.plot_id, items));
          } } />
      </div>
  },
});
PlotConfig.contextTypes = {
  store: React.PropTypes.object
};

module.exports = PlotConfig;
