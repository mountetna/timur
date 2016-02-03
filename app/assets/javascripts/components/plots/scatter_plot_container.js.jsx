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
        { this.props.plot.name }
      </Header>
      {
        this.state.mode == 'edit' ?
        <PlotConfig saves={ this.props.saves } />
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
    if (action == 'cancel') this.setState({mode: 'plot'});
    else if (action == 'approve') {
      this.request_plot_data()
      this.setState({mode: 'submit'});
    }
    else if (action == 'edit') this.setState({mode: 'edit'});
    else if (action == 'close') this.props.handler('close', this.props.plot);
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
