(function() {
// Inspired by http://informationandvisualization.de/blog/bar-plot
d3.bar = function() {
  var width = 1,
      height = 1,
      domain = null,
      tickFormat = null;

  // For each small multiple…
  function bar(g) {
    // Compute the new x-scale.
    var yScale = d3.scale.linear()
          .domain(domain())
          .range([height, 0]),
        yAxis = d3.svg.axis()
          .scale(yScale)
          .tickSize(5)
          .ticks(5)
          .orient('left')
          .tickSubdivide(true);

    var zoom = d3.behavior.zoom()
      .scaleExtent([0,1])
      .on("zoom",function() {
        console.log("Zooming");
        yScale.domain([ 0, domain()[1] * Math.pow(d3.event.scale,0.5)]);
        yElement.call(yAxis);
        //draw();
      })
      .on("zoomend",function() {
        var time = new Date().getTime();
        draw();
        time = (new Date().getTime()) - time;
        console.log("Drawing took "+(time/1000)+" seconds.");
      });

    var yElement = g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    g.call(zoom);

    var rect = g.append("rect")
          .attr("width", 50*width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all");

    draw();

    function draw() {
        var time = new Date().getTime();
        var step;
        g.selectAll("g.bar").remove()
        step = new Date().getTime();
        console.log("Removal took "+((step-time)/1000)+" seconds.");

        g.selectAll("g.bar")
          .data(g.data()[0])
          .enter()
          .append("g")
          .attr("class", "bar")
          .each(function(data, i) {
          var g = d3.select(this);

          // Note: the bar, median, and bar tick elements are fixed in number,
          // so we only have to handle enter and update. In contrast, the outliers
          // and other elements are variable, so we need to exit them! Variable
          // elements also fade in and out.
          var bar = g.append("rect")
              .attr("class", "bar")
              .attr("x", 10 + i * 30)
              .attr("y", yScale(data.height) - yScale(yScale.domain()[1]))
              .attr("width", width)
              .attr("style", "stroke:"+(data.color || "white"))
              .attr("height", yScale(0) - yScale(data.height))

          var newstep = new Date().getTime();
          if (newstep - step > 100) console.log("Drawing bar took "+((newstep-step)/1000)+" seconds.");
          step = newstep;

          if (data.dots) {
            data.dots.forEach(function(dot) {
              g.append("circle")
                .attr("class","dot")
                .attr("r", 2)
                .attr("cx", 10 + i * 30 + ((1000*dot.height)%8)-4 + width/2)
                .attr("cy", yScale(dot.height))
                .on("click", function(d) {
                  console.log("clicking!" + dot.name);
                  d3.event.sourceEvent.stopPropagation();
                  window.location = Routes.browse_model_path('sample', dot.name);
                })
            });
          }
          newstep = new Date().getTime();
          if (newstep - step > 100) console.log("Drawing dots took "+((newstep-step)/1000)+" seconds.");
          step = newstep;

          g.append("text")
            .attr("class", "bar")
            .attr("text-anchor", "start")
            .text(data.series)
            .attr("transform", 'translate('+(10 + i * 30)+','+(yScale(yScale.domain()[0]) + 15)+') rotate(45)');
          newstep = new Date().getTime();
          if (newstep - step > 100) console.log("Drawing text took "+((newstep-step)/1000)+" seconds.");
          step = newstep;

      });
    }
  }

  bar.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bar;
  };

  bar.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bar;
  };

  bar.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bar;
  };

  bar.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return bar;
  };

  return bar;
};

function barWhiskers(d) {
  return [0, d.length - 1];
}

function barQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

})();
