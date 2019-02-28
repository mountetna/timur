import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

const validPoint = (label,value) => label != null && value != null

class Bars extends Component{
  render(){
    let { series, xScale, yScale, width, offset } = this.props;
    let { variables: { category, value, color } } = series;

    let bars = category.values.map((label, index) =>
      validPoint(label, value(index)) &&
      <rect
        key={`bar_${index}`}
        x={ xScale(label)+offset }
        y={ yScale(value(index)) }
        height={ yScale(0)-yScale(value(index)) }
        width={ width }
        fill={ color }
        datavalue={ value(index) }
      />
    );

    return <g className='bar-series'>{bars}</g>;
  }
};

export default Bars;
