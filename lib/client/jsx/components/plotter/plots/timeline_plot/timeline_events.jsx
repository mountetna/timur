import React, {Component} from 'react';

class TimelineEvents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {scales, margins, data, svg_dimensions, max_value} = this.props;
    let {xScale, yScale} = scales;

    const events = data.map((datum, index) => {
      if(
        ( datum.end !== undefined && 
          datum.end !== null) && 
          datum.start !== datum.end) {
        let rect_props = {
          key: `${datum.label}_${index}`,
          x: xScale(new Date(datum.start)),
          y: yScale(datum.label),
          height: yScale.bandwidth(),
          width: xScale(new Date(datum.end)) - xScale(new Date(datum.start)),
          fill: d3.rgb(41, 137, 42),
          onMouseOver: this.props.showToolTip,
          onMouseOut: this.props.hideToolTip,
          'data-value':  JSON.stringify(datum),
          'data-type': datum.label,
          'data-start': datum.start || '',
          'data-end': datum.end || '',
          'data-grade': datum.grade >= 0 ? datum.grade : null
        };
        return <rect {...rect_props}/>;

      } 
      else {
        let cir_props = {
          key: `${datum.label}_${index}`,
          cx: xScale(new Date(datum.start)),
          cy: yScale(datum.label) + yScale.bandwidth() / 2,
          r:  yScale.bandwidth() / 2,
          fill: d3.rgb(41, 137, 42),
          onMouseOver: this.props.showToolTip,
          onMouseOut: this.props.hideToolTip,
          'data-value': JSON.stringify(datum),
          'data-type': datum.label,
          'data-start': datum.start || '',
          'data-end': datum.end || '',
          'data-grade': datum.grade >= 0 ? datum.grade : null
        };
        return <circle {...cir_props}/>;
      }
    })

    return <g>{events}</g>;
  }
}

export default TimelineEvents;