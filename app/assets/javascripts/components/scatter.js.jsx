Scatter = React.createClass({
  getInitialState: function() {
    return { mode: 'plot', mapping: {}, query: {}, current_query: {}, series_names: [ 'series1' ] }
  },
  render_var: function(cvar) {
    if (!cvar) return <span>undefined</span>;
    return <span>cvar.stain + " " + cvar.v1 + "/" + cvar.v2</span>;
  },
  add_series_button: function() {
    if (this.state.mode == 'edit')
      return <input type="button" value="Add Series" onClick={ this.add_series }/>;
  },
  add_series: function() {
    var series_names = this.state.series_names;
    var series_num = series_names.length + 1;
    series_names.push('series' + series_num);
    this.setState({ series_names: series_names });
  },
  render: function() {
    var self = this;
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
      <div className="configure">
        {
          this.add_series_button()
        }
        { 
          this.state.series_names.map(function(series_name) {
            return <PlotSeries update_query={ self.update_query }
              mode={ self.state.mode }
              name={ series_name }
              key={ series_name }
              current={ self.state.current_query[ series_name ] }
              template={ self.props.plot.template } />
          })
        }
        <PlotVarMapping update_query={ this.update_query }
          mode={ this.state.mode }
          template={ this.props.plot.template }
          current={ this.state.current_query.x }
          name='x'/>
        <PlotVarMapping update_query={ this.update_query }
          mode={ this.state.mode }
          template={ this.props.plot.template }
          name='y'
          current={ this.state.current_query.y } />
      </div>
      <svg className="scatter_plot" width="800" height="350"/>
    </div>;
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
        .series(data.series)
        .color(this.state.current_query.series1.color);

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
    var request = $.extend({ series_names: this.state.series_names },this.state.query);
    console.log(request);
    $.get( Routes.scatter_plot_json_path(), request, function(result) {
      mapping = {
        x: request.x_mapping,
        y: request.y_mapping,
      };
      self.setState({
        data: result, 
        mode: 'plot', 
        current_query: $.extend(true, {}, self.state.query)
      });
    });
  }
});
