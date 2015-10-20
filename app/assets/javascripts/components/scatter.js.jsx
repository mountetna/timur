Scatter = React.createClass({
  getInitialState: function() {
    return { mode: 'plot', mapping: {}, query: {}, current_query: {} }
  },
  render_var: function(cvar) {
    if (!cvar) return <span>undefined</span>;
    return <span>cvar.stain + " " + cvar.v1 + "/" + cvar.v2</span>;
  },
  render: function() {
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
      <div className="configure">
        <PlotSeries update_query={ this.update_query }
          mode={ this.state.mode }
          name='series'
          current={ this.state.current_query.series }
          template={ this.props.plot.template } />
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
  componentDidUpdate: function() {
    if (this.state.data) this.d3_render();
  },
  d3_render: function() {
    var data = this.state.data;

    var margin = data.plot.margin,
        width = data.plot.width - margin.left - margin.right,
        height = data.plot.height - margin.top - margin.bottom;

    var xmin = d3.min(data.data, function(s) { return s.x; }),
        xmax = d3.max(data.data, function(s) { return s.x; });
    var ymin = d3.min(data.data, function(s) { return s.y; }),
        ymax = d3.max(data.data, function(s) { return s.y; });

    var chart = d3.scatter()
        .width(width)
        .height(height)
        .xlabel(data.xlabel)
        .ylabel(data.ylabel)
        .xdomain([xmin,xmax])
        .ydomain([ymin,ymax])
        .color(this.state.current_query.series.color);

    console.log("Drawing chart");
    var base = d3.select(React.findDOMNode(this));
    var vis = base.select("svg.scatter_plot");
    vis.selectAll("g").remove()
    vis.selectAll("g")
        .data([data.data])
        .enter().append("g")
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
    var request = this.state.query;
    console.log(request);
    $.get( Routes.scatter_plot_json_path(), request, function(result) {
      mapping = {
        x: request.x_mapping,
        y: request.y_mapping,
      };
      self.setState({
        data: result, 
        mode: 'plot', 
        current_query: self.state.query,
        query: {},
      });
    });
  }
});
