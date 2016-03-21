const PLOT_TYPES = {
  "ScatterPlot": {
    name: "XY Scatter",
    type: "ScatterPlot"
  },
  "OneDScatterPlot": {
    name: "1D Scatter",
    type: "OneDScatterPlot"
  },
  "HeatmapPlot": {
    name: "Heatmap",
    type: "HeatmapPlot",
    analysis: {
      row_dendrogram: {
        method: "dendrogram",
        columns: false
      },
      col_dendrogram: {
        method: "dendrogram",
        columns: true
      },
      z_score: {
        method: "z_score",
        columns: false
      }
    }
  },
  "CorrelationPlot": {
    name: "Correlation",
    type: "CorrelationPlot",
    analysis: {
      correlation: {
        method: "correlation",
        columns: false
      }
    }
  },
  "DensityPlot": {
    name: "Density",
    type: "DensityPlot",
    analysis: {
      density: {
        method: "density",
        bandwidth: 0.05
      }
    }
  },
  "DendrogramPlot": {
    name: "Dendrogram",
    type: "DendrogramPlot",
    analysis: {
      dendrogram: {
        method: "dendrogram",
        columns: true
      }
    }
  }
};

PlotList = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.plot_types_json_path(), function(result) {
      self.setState({ 
                  mode: 'plot',
                  template: result.template, 
                  saves: $.extend(self.default_saves, result.saves ),
                  default_mappings: result.default_mappings
      });
    });
  },
  default_saves: {
    series: {},
    mappings: {},
    plots: {}
  },
  getInitialState: function() {
    return { mode: 'loading', 
      saves: this.default_saves, 
      selected_plot_type: Object.keys(PLOT_TYPES)[0] }
  },
  create_variable: function(var_type) {
    // get the existing saves
    saves = this.state.saves;
    v = this.new_var();
    saves[var_type][v.key] = v;
    this.setState({ saves: saves });
  },
  update_variable: function(var_type, key, prop, value) {
    saves = this.state.saves;
    if (prop == 'remove')
      delete saves[var_type][key];
    else
      saves[var_type][key][prop] = value;
    this.setState({ saves: saves });
  },
  new_var: function() {
    return { key: Math.random().toString(36).substring(7) };
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    var self = this;
    var store = this.context.store;

    if (this.state.mode == 'loading')
      return <div></div>;
    else {
      return <div className="plotter">
                <PlotVariables create={ this.create_variable } 
                  update={ this.update_variable }
                   saves={ this.state.saves }
                   template={ self.state.template } />
                <div className="create">
                  Plot type: 
                  <Selector values={
                    Object.keys(PLOT_TYPES).map(
                      function(type) {
                        var plot_type = PLOT_TYPES[type];
                        return {
                          key: type,
                          value: type,
                          text: plot_type.name
                        }
                      }
                    )
                    }
                    onChange={ function(type) {
                      self.setState({ selected_plot_type: type })
                    } }
                    />
                  <input
                    type="button"
                    onClick={
                      function() { 
                       self.props.dispatch(plotActions.createNewPlot(PLOT_TYPES[self.state.selected_plot_type]));
                      }
                    }
                    value="Add"/>
                </div>
 
                {
                  self.props.plots.map(function(plot, i) {
                    var PlotClass = eval(plot.type+"Container");
                    return <PlotClass 
                      key={ i }
                      plot={ plot } 
                      saves={ self.state.saves }
                      default_mappings={ $.extend({}, self.state.default_mappings) }/>;
                  })
                }
             </div>
    }
  }
});

mapStateToProps = function(state) {
  return {
    plots: state.plots
  }
}

Plotter = connect(
  mapStateToProps
)(PlotList);

Plotter.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Plotter;
