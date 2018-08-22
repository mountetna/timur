import React, {Component} from 'react';
import * as d3 from 'd3';

class Lines extends Component{
  render(){
    let {lines, scales} = this.props;
    let {xScale, yScale} = scales;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let  linePath = d3.line()
      .x(d=>d.x)
      .y(d=>d.y);

    let d3_lines = lines.map(({name, variables: { x, y} }, index) => {
      let points = x.map((l,v,i)=>({ x: xScale(x(i)), y: yScale(y(i)) }));
      let path_props = {
        key: `line_${index}`,
        className: 'line',
        d: linePath(points),
        fill: 'none',
        stroke: color(name)
      };

      return <path {...path_props}></path>;
    });

    return <g>{d3_lines}</g>;
  }
};

export default Lines;
