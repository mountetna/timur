import React, { Component } from "react";
import * as d3 from "d3";

export default class Scatter extends Component {
  render() {
    let { series, xScale, yScale, color } = this.props;
    let {
      name,
      variables: { x, y, label }
    } = series;
    let points = x.map((l, v, i) => ({ x: xScale(x(i)), y: yScale(y(i)) }));

    let labels = label ? label.values : x.labels;

    let xmedian = (parseInt(xScale.range()[0]) + parseInt(xScale.range()[1]))/2;

    return (
      <g className="scatter-series">
        {points.map((point, index) => (
          <g className='circle-group' key={`cir_${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={2}
              fill={color}
            />
            <text textAnchor={ point.x > xmedian ? 'end' : 'start' } x={ point.x + (point.x > xmedian ? -4 : 4) } y={point.y} >{labels[index]}</text>
          </g>
        ))}
      </g>
    );
  }
}
