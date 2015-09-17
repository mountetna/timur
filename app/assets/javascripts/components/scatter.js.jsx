Scatter = React.createClass({
  getInitialState: function() {
    return { mode: 'plot', mapping: {} }
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
        <PlotSeries update_series={ this.update_series } mode={ this.state.mode } template={ this.props.plot.template } series={ this.state.series }/>
        <PlotVarMapping update_mapping={ this.update_mapping } mode={ this.state.mode } template={ this.props.plot.template } name='x' mapping={ this.state.mapping.x } />
        <PlotVarMapping update_mapping={ this.update_mapping } mode={ this.state.mode } template={ this.props.plot.template } name='y' mapping={ this.state.mapping.y } />
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
        .ydomain([ymin,ymax]);

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
  update_series: function(series) {
    this.setState({ series_proposed: series });
  },
  update_mapping: function(v, vmap) {
    mapping = this.state.mapping;
    mapping[v] = vmap;
    this.setState({ mapping: mapping });
  },
  request_plot_data: function() {
    var self = this;
    var request = {
      series: $.extend({}, this.state.series, this.state.series_proposed),
      x_mapping: $.extend({}, this.state.mapping.x, this.state.mapping.x_proposed),
      y_mapping: $.extend({}, this.state.mapping.y, this.state.mapping.y_proposed),
    };
    console.log(request);
    $.get( Routes.scatter_plot_json_path(), request, self.data_update);
  },
  data_update: function(result) {
    // clean up proposed stuff
    mapping = {
      x: $.extend({}, this.state.mapping.x, this.state.mapping.x_proposed),
      y: $.extend({}, this.state.mapping.y, this.state.mapping.y_proposed),
    }
    this.setState({ data: result, mode: 'plot', mapping: mapping, 
      series: $.extend({}, this.state.series, this.state.series_proposed) });
  },
});
