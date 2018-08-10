import React, {Component} from 'react';
import * as d3 from 'd3';

class Lines extends Component{
  render(){
    let {lines, scales} = this.props;
    let {xScale, yScale} = scales;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let  linePath = d3.line()
      .x((d) => (xScale(d.x)))
      .y((d) => (yScale(d.y)));

    let d3_lines = lines.map((line, index) => {

      let path_props = {
        key: `line_${index}`,
        className: 'line',
        d: linePath(line.points),
        fill: 'none',
        stroke: color(line.label)
      };

      return <path {...path_props}></path>;
    });

    return <g>{d3_lines}</g>;
  }
};

export default Lines;