
import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

class Bars extends Component{
  render(){
    let {
        scales, 
        margins, 
        data, 
        svg_dimensions, 
        max_value, 
        color_range
    } = this.props;
    
    let {xScale, yScale} = scales;
    let {height} = svg_dimensions;

    let colorScale = d3.scaleLinear()
      .domain([0, max_value])
      .range(color_range)
      .interpolate(interpolateLab);

    let bars = data.map((datum, index) => {
      let rect_props = {
        key: `bar_${index}`,
        x: xScale(datum.id),
        y: yScale(datum.value),
        height: height - margins.bottom - yScale(datum.value),
        width: xScale.bandwidth(),
        fill: colorScale(datum.value),
        // onMouseOver: this.props.showToolTip,
        // onMouseOut: this.props.hideToolTip,
        'data-value': datum.value,
        'data-type': datum.id
      };

      return <rect {...rect_props}/>;
    });

    return <g>{bars}</g>;
  }
};

export default Bars;