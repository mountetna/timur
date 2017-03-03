var BoxPlotAttribute = React.createClass({
  componentDidMount: function() {
    this.d3_render();
  },
  componentDidUpdate: function() {
    this.d3_render();
  },
  d3_render: function() {
    var margin = {top: 10, right: 20, bottom: 30, left: 0},
        width = 1200 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var data = this.props.value;

    var boxwidth = width / data.length;

    var min = Infinity,
        max = -Infinity;

    var chart = d3.box()
        .whiskers(iqr(1.5))
        .width(20)
        .height(height);


    chart.domain([
        d3.min(data, function(s) {
          return d3.min(s.values, function(d) { return d; })
        }),
        d3.max(data, function(s) {
          return d3.max(s.values, function(d) { return d; })
        })]);

    var vis = d3.select("svg.box_plot").selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "box")
        .attr("transform", function(d,i) {
          return "translate(" + (margin.left + boxwidth/2 + i * boxwidth) + "," + margin.top + ")"
        })
        .call(chart);

    // Returns a function to compute the interquartile range.
    function iqr(k) {
      return function(d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
      };
    }

  },
  render: function() {
    if (this.props.mode == "edit") return <div className="value"/>
    return <div className="value">
              <svg className="box_plot" width="1200" height="200"/>
           </div>
  },
})

module.exports = BoxPlotAttribute
