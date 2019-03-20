import * as d3 from 'd3';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force'

module.exports = function (self) {
  self.addEventListener('message', ev => {
    const {
      category_name,
      values,
      xdomain, xrange,
      ydomain, yrange,
      width,
      radius = 2
    } = ev.data;

    const xScale = d3.scaleBand().domain(xdomain).range(xrange);
    const yScale = d3.scaleBand().domain(ydomain).range(yrange);

    const x = xScale(category_name) + width / 2;

    // simulation for each series to find position of points
    let points = values.map(fy => ({ x, fy }));
    const simulation = forceSimulation(points)
      .force("x", forceX(x).strength(1))
      .force("collide", forceCollide(0.9))
      .stop();

    for (var i = 0; i < 120; i++) simulation.tick();
    //points.forEach( () => simulation.tick() );

    //update x value if outside the y boundaries
    const xmax = x + (width / 2) - radius
    const xmin = x - (width / 2) + radius
    const xvalues = points.map( ({x}) => Math.max(xmin, Math.min( xmax, x)) );
    self.postMessage({category_name, values, xvalues});
  })
}
