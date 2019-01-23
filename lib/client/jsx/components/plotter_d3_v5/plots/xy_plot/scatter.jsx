import React, { Component } from "react";
import * as d3 from "d3";

export default class Scatter extends Component {
  render() {
    let { series, xScale, yScale, color } = this.props;
    let {
      name,
      variables: { x, y }
    } = series;
    let points = x.map((l, v, i) => ({ x: xScale(x(i)), y: yScale(y(i)) }));

    return (
      <g className="circle">
        {points.map((point, index) => (
          <circle
            key={`cir_${index}`}
            cx={point.x}
            cy={point.y}
            r={2}
            fill={color}
          />
        ))}
      </g>
    );
  }
}
