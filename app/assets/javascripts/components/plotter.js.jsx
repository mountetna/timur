Plotter = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.fixed_plots_json_path(), function(result) {
      self.data_update(result);
    });
  },
  data_update: function(result) {
    this.setState( { mode: 'plot', plot_types: result } );
  },
  getInitialState: function() {
    return { mode: 'loading', plots: [] }
  },
  create_plot: function() {
    var node = $(React.findDOMNode(this));
    var name = node.find('select[name=plot_type]').val();
    var plot_type = this.state.plot_types.find(function(p) { return p.type == name });
    var plots = this.state.plots;
    plots.push({
      template: plot_type,
      name: plot_type.name,
      type: plot_type.type
    });
    this.setState( { plots: plots } );
  },
  remove_plot: function(plot) {
    var plots = this.state.plots;
    var index = plots.indexOf(plot);
    if (index != -1) plots.splice(index,1)
      this.setState( { plots: plots } );
  },
  plot_handler: function(command, plot) {
    if (command == 'close') {
      this.remove_plot(plot);
    }
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    var self = this;
    if (this.state.mode == 'loading')
      return <div></div>;
    else {
      return <div className="plotter">
                Plot type: 
                <select name="plot_type" defaultValue="none">
                {
                  this.state.plot_types.map(
                    function(plot_type) {
                      return <option key={plot_type.name} value={plot_type.type} >{ plot_type.name }</option>;
                    }
                  )
                }
                </select>
                <input type="button" onClick={ this.create_plot } value="Add"/>
 
                {
                  this.state.plots.map(function(plot) {
                    var PlotClass = eval(plot.type);
                    return <PlotClass plot={ plot } handler={ self.plot_handler } />;
                  })
                }
             </div>
    }
  }
});
