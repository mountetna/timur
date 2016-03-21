HeatmapPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  componentWillMount: function() {
    var store = this.context.store;
    store.dispatch(
      plotActions.updateRequestedMappings(
        this.props.plot.plot_id, Object.keys(this.props.default_mappings)
      )
    );
  },
  render: function() {
    var self = this;

    var all_series = [];
    var plot = this.props.plot;
    var row_dend, col_dend
    
    if (plot.series) {
      all_series = plot.series.map(function(series,series_num) {
        var series_def = self.props.saves.series[series.key];
        var matrix = new Matrix(series.matrix.rows, 
                                series.matrix.row_names,
                                series.matrix.col_names
                               );
        if (plot.results.z_score) {
          var z_series = plot.results.z_score.series[series_num]
          matrix = new Matrix(z_series.matrix.rows,
                              z_series.matrix.row_names,
                              z_series.matrix.col_names)
        }
        if (plot.results.row_dendrogram) {
          // sort rows according to row dendrogram
          var tree = new Tree(plot.results.row_dendrogram.tree)
          var leaves = {}
          tree.leaves().forEach(function(leaf, i) {
            leaves[leaf.name] = i
          })
          matrix = matrix.row_sort(function( a_row, a_name, b_row, b_name ) {
            return leaves[b_name] - leaves[a_name]
          })
          row_dend = tree
        }
        
        if (plot.results.col_dendrogram) {
          // sort cols according to col dendrogram
          var tree = new Tree(plot.results.col_dendrogram.tree)
          var leaves = {}
          tree.leaves().forEach(function(leaf, i) {
            leaves[leaf.name] = i
          })
          matrix = matrix.col_sort(function( a_col, a_name, b_col, b_name ) {
            return leaves[a_name] - leaves[b_name]
          })
          col_dend = tree
        }
        return {
          matrix: matrix,
          name: series_def.name,
          color: series_def.color
        };
      });
    }

    return <div className="heatmap plot">
      <PlotHeader mode={ this.state.mode } 
        name="Heatmap"
        plot={ plot }
        newMode={ function(mode) { self.setState({mode: mode}); } }
        onApprove={
          function() {
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
          series_limits={ [ "Series" ] }
          mappings_limits={ [] }
          current_mappings={ [] }
          series={ this.props.saves.series }
          mappings={ {} }
          />
        :
        null
      }
      <HeatmapPlot data_key={ plot.data_key } data={ all_series } plot={{
          width: 1200,
          height: 1200,
          margin: {
            left: 250,
            top: 150,
            bottom: 40,
            right: 250
          }
      }}
          row_dendrogram={ row_dend }
          col_dendrogram={ col_dend }
        />
    </div>;
  },
});
HeatmapPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = HeatmapPlotContainer;
