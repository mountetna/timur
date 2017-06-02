import React from 'react'
import { tickFormatter } from '../../utils/d3_scale.js'

const YAxis = ({
  scale,
  num_ticks,
  tick_width,
  ymin,
  ymax,
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