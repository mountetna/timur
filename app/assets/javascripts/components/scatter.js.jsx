Scatter = React.createClass({
  render: function() {
    return <div className="scatter_plot">
      <div className="configure">
        <Filter indications={ this.props.plot.indications }/>
        <VarSelect variables={ this.props.plot.variables } name='x'/>
        <VarSelect variables={ this.props.plot.variables } name='y'/>
        <input type="button" onClick={ this.do_plot } value="Plot"/>
      </div>
      <svg className="scatter_plot" width="800" height="350"/>
    </div>;
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
    var vis = d3.select("svg.scatter_plot");
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
  do_plot: function() {
    var self = this;
    var node = $(React.findDOMNode(this));
    var request = {
      indication: node.find('select[name=indication]').val(),
      xstain: node.find('select[name=xstain]').val(),
      x_var1: node.find('select[name=x1]').val(),
      x_var2: node.find('select[name=x2]').val(),
      ystain: node.find('select[name=ystain]').val(),
      y_var1: node.find('select[name=y1]').val(),
      y_var2: node.find('select[name=y2]').val(),
    };
    console.log(request);
    $.get( Routes.scatter_plot_json_path(), request, function(result) {
      self.data_update(result);
    });
  },
  update_stain: function() {
    var node = $(React.findDOMNode(this));
    var stain = node.find('select[name=stain]').val();
    this.setState({ stain_variables: this.props.plot.variables[stain] });
  },
  data_update: function(result) {
    this.setState({ data: result });
  },
  var_select: function(name, values) {
    return <select name={ name } onChange={ this.update_stain }>
      {
        values.map(function(v) {
          return <option key={v} value={v} >{ v }</option>;
        })
      }
    </select>
  }
});
