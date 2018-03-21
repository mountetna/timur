// Framework libraries.
import * as React from 'react';

import * as D3Scale from '../../utils/d3_scale.js';

export default class YAxis extends React.Component{
  constructor(props){
    super(props);
  }

  renderTics(){
    let {
      scale,
      num_ticks,
      x = 0,
      y = 0
    } = this.props;

    let ticks = this.props.ticks || scale.ticks(num_ticks);
    let tick_width = this.props.tick_width || 1;
    let tick_elems = ticks.map((tick, index)=>{
      let y = scale(tick);

      let line_props = {
        x1: x - 1,
        y1: y || 0,
        x2: x - tick_width,
        y2: y || 0
      };

      let text_props = {
        textAnchor: 'end',
        transform: 'translate(' + (x - tick_width - 2) + ',' + (y + 2) + ')'
      };

      return (
        <g key={index}>

          <text {...text_props}>

            {D3Scale.tickFormatter(ticks, scale)(tick)}
          </text>
          <line {...line_props} />
        </g>
      );
    });

    return tick_elems;
  }

  render(){

    let {
      scale,
      num_ticks,
      tick_width,
      ymin = 0,
      ymax = 0,
      x = 0,
      label,
      ticks = scale.ticks(num_ticks),
      plotAreaHeight = 0
    } = this.props;

    let text_props = {
      textAnchor: 'middle',
      transform: 'translate(-70,' + ((scale(ymin) + scale(ymax)) / 2 || plotAreaHeight / 2) + ') rotate(-90)'
    };

    let y1 = scale(ymin);
    let y2 = scale(ymin);

    let line_props = {
      x1: x,
      y1: (isNaN(y1)) ? 0 : y1,
      x2: x,
      y2: (isNaN(y2)) ? 0 : y2,
    };

    return(
      <g className='axis'>

        <text {...text_props}>

          {label}
        </text>
        <line {...line_props} />
        {this.renderTics()}
      </g>
    );
  }
}

/*
import React from 'react'
import { tickFormatter } from '../../utils/d3_scale.js'

const YAxis = ({
  scale,
  num_ticks,
  tick_width,
  ymin = 0,
  ymax = 0,
  x = 0,
  label,
  ticks = scale.ticks(num_ticks),
  plotAreaHeight
}) => (
  <g className="axis">
    <text textAnchor="middle" transform={ 'translate(-70,' + ((scale(ymin) + scale(ymax)) / 2 || plotAreaHeight / 2) + ') rotate(-90)'}>
      {label}
    </text>
    <line
      x1={x}
      y1={typeof ymin !== 'undefined' ? scale(ymin) : 0}
      x2={x}
      y2={typeof ymax !== 'undefined' ? scale(ymax) : plotAreaHeight}
    />
    {ticks.map((tick,i) => {
      const y = scale(tick)
      return (
        <g key={i}>
          <text textAnchor="end" transform={'translate(' + (x - tick_width - 2) + ',' + (y + 2) + ')' }>
            {tickFormatter(ticks, scale)(tick)}
          </text>
          <line
            x1={x - 1}
            y1={y || 0}
            x2={x - tick_width}
            y2={y || 0}
          />
        </g>
      )
    })}
  </g>
)

export default YAxis
*/