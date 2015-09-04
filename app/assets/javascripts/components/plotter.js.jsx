Plotter = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.fixed_plots_json_path(), function(result) {
      self.data_update(result);
    });
  },
  data_update: function(result) {
    this.setState( { mode: 'choose', plots: result } );
  },
  getInitialState: function() {
    return { mode: 'loading' }
  },
  select_plot: function(e) {
    var plot = this.state.plots.find(function(p) { return p.type == e.target.value });
    this.setState( { mode: 'plot', plot: plot } );
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    if (this.state.mode == 'loading')
      return <div></div>;
    else {
      var plot_html;
      if (this.state.mode == 'plot' && this.state.plot.type != 'none') {
        var PlotClass = eval(this.state.plot.type);
        plot_html = <PlotClass plot={ this.state.plot }/>;
      }
      return <div >
                Plot type: 
                <select name="plot_type" onChange={ this.select_plot } defaultValue="none">
                {
                  this.state.plots.map(
                    function(plot) {
                      return <option key={plot.name} value={plot.type} >{ plot.name }</option>;
                    }
                  )
                }
                </select>

                {
                  plot_html
                }
             </div>
    }
  }
});
