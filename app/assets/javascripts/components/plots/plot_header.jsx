import React, { Component } from 'react';

var PlotHeader = React.createClass({
  render: function() {
    return <Header mode={ this.props.mode } 
      handler={ this.header_handler }
      can_edit={ true }
      can_close={ true }>
      { this.props.name }
    </Header>
  },
  header_handler: function(action) {
    var self = this;
    switch(action) {
      case 'cancel':
        var store = this.context.store;

        this.props.newMode('plot');
        store.dispatch(plotActions.cancelPlotConfig(this.props.plot.plot_id));
        break;
      case 'approve':
        // allow approval checking by each plot
        var store = this.context.store;
        var self = this;
        if (this.props.onApprove && !this.props.onApprove()) break;

        this.props.newMode('submit');
        store.dispatch(plotActions.requestPlotData(this.props.plot, function(plot_json) {
          self.props.newMode('plot');
        }));
        break;
      case 'edit':
        this.props.newMode('edit');
        break;
      case 'close':
        var store = this.context.store;
        store.dispatch(plotActions.closePlot(this.props.plot.plot_id));
        break;
    }
  }
});
PlotHeader.propTypes = {
  newMode: React.PropTypes.func.isRequired
};
PlotHeader.contextTypes = {
  store: React.PropTypes.object
};

module.exports = PlotHeader;
