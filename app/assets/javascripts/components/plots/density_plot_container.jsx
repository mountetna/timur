import DensityPlot from './density_plot';
import React, { Component } from 'react';

var DensityPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  render: function() {
    var self = this;

    var all_series = [];
    var plot = this.props.plot;
    
    if (plot.results && plot.results.density) {
      all_series = plot.results.density.series.map(function(series) {
        var series_def = self.props.saves.series[series.key];
        //var matrix = new Matrix( series.matrix.rows, series.matrix.row_names, series.matrix.col_names );
        return {
          rows: series.matrix.rows,
          row_names: series.matrix.row_names,
          col_names: series.matrix.col_names,
          name: series_def.name,
          color: series_def.color
        };
      });
    }

    return <div className="density plot">
      <PlotHeader mode={ this.state.mode } 
        name="Density"
        plot={ plot }
        newMode={ function(mode) { self.setState({mode: mode}); } }
        onApprove={
          function() {
            if (plot.requested_mappings.length == 0 ) {
              alert('You need to have at last one mapping value.');
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
          series_limits={ [ "Series" ] }
          mappings_limits={ [ "Mapping" ] }
          series={ this.props.saves.series }
          mappings={ { ...this.props.saves.mappings, ...this.props.default_mappings } }/>
        :
        null
      }
      <DensityPlot data_key={ plot.data_key } data={ all_series } plot={{
          width: 900,
          height: 500,
          margin: {
            left: 60,
            top: 20,
            bottom: 40,
            right: 200
          }
        }}/>
    </div>;
  },
});
DensityPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DensityPlotContainer;
