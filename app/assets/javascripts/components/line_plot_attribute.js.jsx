LinePlotAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  componentDidMount: function() {
    this.d3_render();
  },
  componentDidUpdate: function() {
    this.d3_render();
  },
  d3_render: function() {
    var lines = this.attribute_value().map(function(line) {
      line.values = line.values.map(function(a) {
        return {
          x: new Date(a.x),
          y: a.y
        }
      });
      return line;
    });
    var vis = d3.select('svg.line_plot'),
        WIDTH = 600,
        HEIGHT = 200,
        MARGINS = {
          top: 20,
          right: 100,
          bottom: 50,
          left: 70
        },
        xRange = d3.time.scale()
           .range([MARGINS.left, WIDTH - MARGINS.right])
           .domain([d3.min(lines, function(line) {
                return d3.min(line.values, function(d) { return d.x; });
              }), d3.max(lines, function(line) {
                return d3.max(line.values, function(d) { return d.x; });
              })]),
        yRange = d3.scale.linear()
          .range([HEIGHT - MARGINS.bottom, MARGINS.top])
          .domain([d3.min(lines, function(line) {
                return d3.min(line.values, function(d) { return d.y; });
              }), d3.max(lines, function(line) {
                return d3.max(line.values, function(d) { return d.y; });
              })]),
        xAxis = d3.svg.axis()
          .scale(xRange)
          .tickSize(5)
          .ticks(5)
          .tickSubdivide(true),
        yAxis = d3.svg.axis()
          .scale(yRange)
          .tickSize(5)
          .ticks(5)
          .orient('left')
          .tickSubdivide(true);
     
    vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
      .call(xAxis);
     
    vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
      .call(yAxis);

    vis.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("dy", ".75em")
    .attr("transform", "translate(0," + ((MARGINS.top + HEIGHT-MARGINS.bottom) / 2) + 
      ") rotate(-90)")
    .text("sample count");

    lines.forEach(function(line) {
      var lineFunc = d3.svg.line()
        .x(function(d) {
          return xRange(d.x);
        })
        .y(function(d) {
          return yRange(d.y);
        })
        .interpolate('linear');

      vis.append('svg:path')
        .attr('d', lineFunc(line.values))
        .attr('stroke', line.color)
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    });

    var legend = vis.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 100);

    legend.selectAll('rect')
      .data(this.attribute_value())
      .enter()
      .append("rect")
      .attr("x", WIDTH - MARGINS.right + 10)
      .attr("y", function(d, i){ return 10 + i *  20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) { 
         return d.color;
      });
    legend.selectAll('text')
      .data(this.attribute_value())
      .enter()
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", WIDTH - MARGINS.right + 25)
      .attr("y", function(d, i) { return 20 + i *  20;})
      .text(function(d) { return d.series; });;
  },
  render_browse: function() {
    return <div className="value">
              <svg className="line_plot" width="600" height="200"></svg>
           </div>
  },
  render_edit: function() {
    return <div className="value">
           </div>
  },
});

module.exports = LinePlotAttribute;
