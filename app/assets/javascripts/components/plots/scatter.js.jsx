ScatterPlot = React.createClass({
  getInitialState: function() {
    return {
      mode: 'plot', 
      series: []
   }
  },
  render_edit: function() {
    var self = this;
    if (this.state.mode == 'plot') return null;
    return <div className="configure">
        Series: 
        {
          this.state.series.map(function(series_name) {
            return <div key={ series_name }>{ self.props.saves.series[series_name].name }</div>;
          })
        }
        <Selector showNone="disabled" name="series" values={ $.map(this.props.saves.series,this.mapping_map) }/>
        <input type="button" value="Add Series" onClick={ this.add_series }/>
        <div>
        x: <Selector showNone="disabled" name="x" onChange={ this.set_mapping } values={ $.map(this.props.saves.mappings,this.mapping_map) }/>
        y: <Selector showNone="disabled" name="y" onChange={ this.set_mapping } values={ $.map(this.props.saves.mappings,this.mapping_map) }/>
        </div>
      </div>
  },
  add_series: function() {
    var series = this.state.series;
    var select = $(React.findDOMNode(this)).find('select[name="series"]');
    series.push(select.val())
    console.log(series);
    this.setState({ series: series });
  },
  set_mapping: function(e) {
    var update = {}
    update[e.target.name] = e.target.value;
    this.setState(update);
  },
  render: function() {
    var self = this;
    var data = this.state.data.map(function(series) {
      return new DataMatrixSeries(series);
    });

    var xmin = d3.min(data, function(s) { return s.row_min(0); });
    var xmax = d3.max(data, function(s) { return s.row_max(0); });
    var ymin = d3.min(data, function(s) { return s.row_min(1); });
    var ymax = d3.max(data, function(s) { return s.row_max(1); });

    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
        {
          this.render_edit()
        }
      <svg 
        className="scatter_plot" 
        width={ 900 }
        height={ 300 } >
        <PlotCanvas
          x={ 10 } y={ 10 }
          width={ width }
          height={ height }>
        <YAxis x={ -3 }
          scale={ yScale }
          ymin={ this.props.ymin }
          ymax={ zoom_ymax }
          num_ticks={5}
          tick_width={ 5 }/>
        <XAxis />
        <Legend x={ width - margin.right - 30 } y="0" series={ this.props.legend }/>
        {
          this.props.data.map(function(datum,i) {
          })
        }
        </PlotCanvas>
      </svg>
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
  d3_render: function() {
    var data = this.state.data;
    var self = this;

    var margin = data.plot.margin,
        width = data.plot.width - margin.left - margin.right,
        height = data.plot.height - margin.top - margin.bottom;

    var xmin = d3.min(data.series, function(s) { return d3.min(s.values, function(v) { return v.x; }); }),
        xmax = d3.max(data.series, function(s) { return d3.max(s.values, function(v) { return v.x; }); });
    var ymin = d3.min(data.series, function(s) { return d3.min(s.values, function(v) { return v.y; }); }),
        ymax = d3.max(data.series, function(s) { return d3.max(s.values, function(v) { return v.y; }); });

    console.log(xmin);
    console.log(xmax);

    var chart = d3.scatter()
        .width(width)
        .height(height)
        .xlabel(data.xlabel)
        .ylabel(data.ylabel)
        .xdomain([xmin,xmax])
        .ydomain([ymin,ymax])
        .series(data.series.map( function(s) {
          var save = self.props.saves.series[s.key];
          s.name = save.name;
          s.color = save.color;
          return s;
        }));

    console.log("Drawing chart");
    var base = d3.select(React.findDOMNode(this));
    var vis = base.select("svg.scatter_plot");
    vis.selectAll("g.plot").remove()
    vis.selectAll("g.plot")
        .data([data])
        .enter()
        .append("g")
        .attr("class", "plot")
        .attr("transform", function(d,i) {
          return "translate(" + margin.left + "," + margin.top + ")"
        })
        .call(chart);
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



DataMatrixSeries = function(series) {
  var filtered_values = this.filter_null_columns();

  this.filter_null_columns = function() {
    // values is an n x m array of arrays. we want a reduced version
    // that is n x p
    var size = series.samples.size;
  }

  this.row_min = function(row) {
    // returns the minimum value for a row in this series
    Math.min.apply(null, series.values[row].filter(function(n) { 
      return n != undefined 
    }))
  }
}
