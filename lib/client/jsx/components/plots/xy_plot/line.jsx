import React, { Component } from "react";
import * as d3 from "d3";

export default class Line extends Component {
  render() {
    let { series, xScale, yScale, color } = this.props;
    let {
      variables: { x, y }
    } = series;
    let linePath = d3
      .line()
      .x(d => d.x)
      .y(d => d.y);

    let points = x.map((l, v, i) => ({ x: xScale(x(i)), y: yScale(y(i)) }));
    let path_props = {
      className: "line",
      d: linePath(points),
      fill: "none",
      stroke: color
    };

    return <path {...path_props} />;
  }
}
