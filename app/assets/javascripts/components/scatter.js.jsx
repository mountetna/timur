Scatter = React.createClass({
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
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
        {
          this.render_edit()
        }
      <svg className="scatter_plot" width="800" height="350"/>
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
  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.data != prevState.data) this.d3_render();
  },
  d3_render: function() {
    var data = this.state.data;

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
        .series(data.series);

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
        series: this.state.series.map(function(key) {
          return self.props.saves.series[key];
        }),
        x: this.props.saves.mappings[this.state.x],
        y: this.props.saves.mappings[this.state.y],
      };
    console.log(request);
    $.get( Routes.scatter_plot_json_path(), request, function(result) {
      self.setState({
        data: result, 
        mode: 'plot'
      });
    });
  }
});
