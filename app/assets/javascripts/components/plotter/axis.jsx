import React, {Component} from 'react';
import * as d3Axis from 'd3-axis';
import {select as d3Select} from 'd3-selection';

class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const axis_type = `axis${this.props.orient}`;
    const axis = d3Axis[axis_type]()
      .scale(this.props.scale)
      .tickSize(-this.props.tick_size)
      .tickPadding([12])
      .ticks([4]);

    d3Select(this.axisElement).call(axis);
  }

  render() {
    return (
      <g
        className={`Axis Axis-${this.props.orient}`}
        ref={(el) => {this.axisElement = el;}}
        transform={this.props.translate}
      />
    )
  }
}

export default Axis;