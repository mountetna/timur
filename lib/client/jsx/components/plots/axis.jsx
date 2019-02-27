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
    let axis_type = `axis${this.props.orient}`;
    let axis = d3[axis_type](this.props.scale)
      .tickSize(-this.props.tickSize)
      .ticks(5)
      .tickPadding([12]);

    if(this.props.timeformat){
      axis.tickFormat(d3.timeFormat(this.props.timeformat));
    }

    d3.select(this.axisElement).call(axis);
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
