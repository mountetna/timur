import React, { Component } from 'react'
import * as d3 from 'd3';

export default class Axis extends Component{
  componentDidMount(){
    this.renderAxis();
  }

  componentDidUpdate(){
    this.renderAxis();
  }

  renderAxis(){
    //Add scales to axis
    let { scale, orient, timeformat, tickSize } = this.props;

    let axis_type = `axis${orient}`;
    let axis = d3[axis_type](scale)
      .tickSize(-tickSize)
      .ticks(5)
      .tickPadding([12]);

    if (scale.type == 'linear') {
      axis.tickFormat(d3.format('.2g'));
    }

    if(timeformat){
      axis.tickFormat(d3.timeFormat(timeformat));
    }

    let fontSize = scale.bandwidth ? Math.min(
      Math.ceil(0.75 * scale.bandwidth()),
      12
    ) : 11;

    let element = d3.select(this.axisElement)

    element.selectAll("*").remove();
    element.append('g').style('font-size', `${fontSize}px`).call(axis);
  }

  render(){
    let { orient, translate } = this.props;
    return <g
      className={ `axis axis-${orient}` }
      ref={ el => this.axisElement = el }
      transform={ translate }
    />;
  }
}
