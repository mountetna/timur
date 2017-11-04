import DendrogramPlot from './dendrogram_plot';
import React, { Component } from 'react';

var DendrogramPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  componentDidMount: function() {
    var store = this.context.store;
    store.dispatch(
      plotActions.updateRequestedMappings(
        this.props.plot.plot_id, Object.keys(this.props.default_mappings)
      )
    );
  },
  render: function() {
    var self = this;

    var tree
    var plot = this.props.plot
    
    if (plot.results && plot.results.dendrogram) {
      tree = plot.results.dendrogram.tree
    }

    return <div className="plot">
      <PlotHeader mode={ this.state.mode } 
        name="Dendrogram"
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
      <DendrogramPlot data_key={ plot.data_key } data={ tree } plot={{
          width: 1200,
          height: 600,
          margin: {
            left: 50,
            top: 50,
            bottom: 200,
            right: 50
          }
        }}/>
    </div>;
  },
});
DendrogramPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DendrogramPlotContainer;
