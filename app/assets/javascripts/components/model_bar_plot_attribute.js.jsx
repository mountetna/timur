BarPlotAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  componentDidMount: function() {
    this.d3_render();
  },
  componentDidUpdate: function() {
    if (this.props.mode == 'browse') this.d3_render();
  },
  d3_render: function() {
    var data = this.attribute_value();

    var margin = data.plot.margin,
        width = data.plot.width - margin.left - margin.right,
        height = data.plot.height - margin.top - margin.bottom;

    var barwidth = width / data.data.length;

    var min = Infinity,
        max = -Infinity;

    var chart = d3.bar()
        .width(20)
        .height(height);

    min = d3.min(data.data, function(s) { return s.height; });
    max = d3.max(data.data, function(s) { return s.height; });

    min = (min > 0) ? 0 : min;
    max = (max < 0) ? 0 : max;
    chart.domain([min,max]);

    var vis = d3.select("svg#" + data.plot.name + ".bar_plot").selectAll("g")
        .data([data.data])
        .enter().append("g")
        .attr("class", "plot")
        .attr("transform", function(d,i) {
          return "translate(" + margin.left + "," + margin.top + ")"
        })
        .call(chart);
    var legend = vis.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 100);

    legend.selectAll('rect')
      .data(data.legend.colors)
      .enter()
      .append("rect")
      .attr("x", width - margin.right - 30)
      .attr("y", function(d, i){ return 10 + i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) { return d; });
    legend.selectAll('text')
      .data(data.legend.series)
      .enter()
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", width - margin.right - 15)
      .attr("y", function(d, i) { return 20 + i *  20;})
      .text(function(d) { return d; });;
  },
  render_browse: function() {
    var plot = this.attribute_value().plot;
    return <div className="value">
              <svg id={ plot.name } className="bar_plot" width={ plot.width } height={ plot.height }></svg>
           </div>
  },
  render_edit: function() {
    return <div className="value">
           </div>
  },
});
