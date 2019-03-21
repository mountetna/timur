import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

const validPoint = (label,value) => label != null && value != null

class Bars extends Component{
  render(){
    let { series, xScale, yScale, width, offset, color } = this.props;
    let { variables: { category, value } } = series;

    let boxwidth = Math.max(4,Math.min(width,20));

    let bars = category.values.map((label, index) =>
      validPoint(label, value(index)) &&
      <rect
        key={`bar_${index}`}
        x={ xScale(label)+ offset + width / 2 - boxwidth / 2 }
        y={ yScale(value(index)) }
        height={ yScale.range()[0]-yScale(value(index)) }
        width={ boxwidth }
        fill={ color }
        stroke={ color }
        datavalue={ value(index) }
      />
    );

    return <g className='bar-series'>{bars}</g>;
  }
};

export default Bars;
