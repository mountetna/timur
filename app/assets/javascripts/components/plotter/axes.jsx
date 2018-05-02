import React, {Component} from 'react';
import Axis from './axis';

class Axes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {scales, margins, svg_dimensions} = this.props;
    const {height, width} = svg_dimensions;

    const x_props = {
      orient: 'Bottom',
      scale: scales.xScale,
      translate: `translate(0, ${height - margins.bottom})`,
      tick_size: height - margins.top - margins.bottom,
    };
  
    const y_props = {
      orient: 'Left',
      scale: scales.yScale,
      translate: `translate(${margins.left}, 0)`,
      tick_size: width - margins.left - margins.right,
    };

    return (
      <g>
        <Axis {...x_props} />
        <Axis {...y_props} />
      </g>
    )
  }
}

export default Axes;