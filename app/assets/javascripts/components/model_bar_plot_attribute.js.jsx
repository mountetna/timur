BarPlotAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  componentDidMount: function() {
    this.d3_render();
  },
  componentDidUpdate: function() {
    if (this.props.mode == 'browse') this.d3_render();
  },
  d3_render: function() {
    var margin = {top: 10, right: 20, bottom: 120, left: 50},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var data = this.attribute_value();

    var barwidth = width / data.length;

    var min = Infinity,
        max = -Infinity;

    var chart = d3.bar()
        .width(20)
        .height(height);

    min = d3.min(data, function(s) { return s.height; });
    max = d3.max(data, function(s) { return s.height; });

    min = (min > 0) ? 0 : min;
    max = (max < 0) ? 0 : max;
    chart.domain([min,max]);

    var vis = d3.select("svg.bar_plot").selectAll("g")
        .data([data])
        .enter().append("g")
        .attr("class", "plot")
        .attr("transform", function(d,i) {
          return "translate(" + margin.left + "," + margin.top + ")"
        })
        .call(chart);
  },
  render_browse: function() {
    return <div className="value">
              <svg className="bar_plot" width="600" height="300"></svg>
           </div>
  },
  render_edit: function() {
    return <div className="value">
           </div>
  },
});
