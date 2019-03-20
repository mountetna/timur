import React, { Component } from "react";
import * as d3 from "d3";
import Link from '../../link';


const Dot = ({point, xmedian, label, model, color}) => {
  let dot = <g>
    <circle
      cx={point.x}
      cy={point.y}
      r={2.5}
      fill={color}
    />
    { label && <text textAnchor={ point.x > xmedian ? 'end' : 'start' } x={ point.x + (point.x > xmedian ? -4 : 4) } y={point.y} >{label}</text> }
  </g>;
  return <g className='dot'>
   {
     (model && label) ?
       <Link link={
         Routes.browse_model_path(
           TIMUR_CONFIG.project_name,
           model,
           label
         )}>{dot}</Link> : dot
   }
  </g>;
}
export default class Scatter extends Component {
  render() {
    let { series, xScale, yScale, color } = this.props;
    let {
      name,
      variables: { x, y, label, model }
    } = series;
    let points = x.map((l, v, i) => ({ x: xScale(x(i)), y: yScale(y(i)) }));

    let labels = label ? label.values : x.labels;

    let xmedian = (parseInt(xScale.range()[0]) + parseInt(xScale.range()[1]))/2;

    return (
      <g className="scatter-series">
        {points.map((point, index) => (
          <Dot
            key={`cir_${index}`}
            point={point}
            xmedian={xmedian}
            label={labels[index]}
            model={model}
            color={color}
          />
        ))}
      </g>
    );
  }
}
