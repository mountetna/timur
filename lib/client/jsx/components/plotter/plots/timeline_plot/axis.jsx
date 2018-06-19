import React, { Component } from 'react'
import * as d3 from 'd3';

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    //Add scales to axis
    let axis;

    switch(this.props.orient) {
      case 'timeline-bottom':
        axis = d3.axisBottom(this.props.scale)
          .tickSize(-this.props.tickSize)
          .tickPadding([12])
          .tickFormat(d3.timeFormat("%b '%y"));
        break;
      case 'ordinal-left':
        axis = d3.axisLeft(this.props.scale)
          .tickSize(-this.props.tickSize)
          .tickPadding([12]);
        break;
    }

    d3.select(this.axisElement).call(axis);
  }

  render() {
    let props = {
      className: `Axis Axis-${this.props.orient}`,
      ref: (el) => { this.axisElement = el; },
      transform: this.props.translate
    };
    return <g {...props}/>;
  }
}