Scatter = React.createClass({
  render: function() {
    return <form>
      Indication:  { this.var_select('indication', this.props.plot.indications) }
      X var: { this.var_select('x', this.props.plot.variables) } 
      Y var: { this.var_select('y', this.props.plot.variables) } 
      <input type="button" onClick={ this.do_plot } value="Plot"/>
      <svg className="scatter_plot" width="800" height="350"/>
    </form>;
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
      indication: node.children('select[name=indication]').val(),
      x_var: node.children('select[name=x]').val(),
      y_var: node.children('select[name=y]').val(),
    };
    $.get( Routes.scatter_plot_json_path(request), function(result) {
      self.data_update(result);
    });
  },
  data_update: function(result) {
    this.setState({ data: result });
  },
  var_select: function(name, values) {
    return <select name={ name }>
      {
        values.map(function(v) {
          return <option key={v} value={v} >{ v }</option>;
        })
      }
    </select>
  }
});
