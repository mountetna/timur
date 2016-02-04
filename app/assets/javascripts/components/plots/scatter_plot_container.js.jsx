requestPlotData = function(plot_id) {
  return {
    type: 'REQUEST_PLOT_DATA',
    plot_id: plot_id
  }
}

requestPlotData = function(plot_id) {
  return function(dispatch) {
    fetch(route, {
    }).then(function(response) {
    }).catch(function(error) {
    })
  }
}

ScatterPlotContainer = React.createClass({
  getInitialState: function() {
    return {
      mode: 'plot', 
      series: [],
      data: []
   }
  },
  add_series: function() {
    var series = this.state.series;
    var select = $(React.findDOMNode(this)).find('select[name="series"]');
    series.push(select.val())
    this.setState({ series: series });
  },
  set_mapping: function(e) {
    var update = {}
    update[e.target.name] = e.target.value;
    this.setState(update);
  },
  render: function() {
    var self = this;

    var all_series = this.state.data.map(function(series, i) {
      var series_def = self.props.saves.series[self.state.series[i]];
      var row_names = self.state.mappings.map(function(key) { return self.props.saves.mappings[key].name; } );
      var matrix = new Matrix( series.values, row_names, series.samples );
      return {
        matrix: matrix.col_filter(function(col) {
          return col.every(function(v) { return v != undefined });
        }),
        name: series_def.name,
        color: series_def.color
      };
    });

    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        XY Scatter
      </Header>
      {
        this.state.mode == 'edit' ?
        <PlotConfig plot_id={this.props.plot.plot_id} saves={ this.props.saves } />
        :
        null
      }
      <ScatterPlot data={ all_series } plot={{
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
  mapping_map: function(mapping) {
    return {
      key: mapping.key,
      value: mapping.key,
      text: mapping.name
    }
  },
  header_handler: function(action) {
    switch(action) {
      case 'cancel':
        this.setState({mode: 'plot'});
        break;
      case 'approve':
        var store = this.context.store;
        this.setState({mode: 'submit'});
        store.dispatch(requestPlotData(this.props.plot.plot_id));
        break;
      case 'edit':
        this.setState({mode: 'edit'});
        break;
      case 'close':
        this.props.handler('close', this.props.plot);
        break;
    }
  },
  update_query: function(name, value) {
    query = this.state.query;
    query[ name ] = value;
    this.setState({ query: query });
  },
  request_plot_data: function() {
    var self = this;
    var request = {
        series: this.state.series,
        mappings: [ this.state.x, this.state.y ]
      };
    console.log(request);
    $.ajax({
      url: Routes.plot_json_path(), 
      type: 'POST',
      data: JSON.stringify(request), 
      dataType: 'json',
      contentType: 'application/json',
      success: function(result) {
        self.setState({ data: result.data, series: result.series, mappings: result.mappings, mode: 'plot' });
      }
    });
  }
});
ScatterPlotContainer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ScatterPlotContainer;
