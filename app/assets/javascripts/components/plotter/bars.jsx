import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';
import {interpolateLab} from 'd3-interpolate';

class Bars extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {scales, margins, data, svg_dimensions, max_value} = this.props;
    const {xScale, yScale} = scales;
    const {height} = svg_dimensions;

    let colorScale = scaleLinear()
      .domain([0, max_value])
      .range(['#cbf2bb', '#46a21f'])
      .interpolate(interpolateLab);

    const bars = (data.map(datum => {
      let rect_props = {
        key: datum.id,
        x: xScale(datum.id),
        y: yScale(datum.value),
        height: height - margins.bottom - scales.yScale(datum.value),
        width: xScale.bandwidth(),
        fill: colorScale(datum.value)
      }

      return <rect {...rect_props}/>;
    }))

    return <g>{bars}</g>;
  }
}

export default Bars;