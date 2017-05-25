import React from 'react'
import { tickFormatter } from '../../utils/d3_scale.js'

const XAxis = ({
  scale,
  num_ticks,
  tick_width,
  xmin,
  xmax,
  y,
  label,
  ticks = scale.ticks(num_ticks),
  plotAreaWidth,
}) => (
  <g className="axis">
    <text textAnchor="middle" transform={'translate(' + (scale(xmin) + scale(xmax)) / 2 + ',' + (y + 100) + ')'}>
      {label}
    </text>
    <line
      y1={y}
      x1={xmin ? scale(xmin) : 0}
      y2={y}
      x2={xmax ? scale(xmax) : plotAreaWidth}
    />
    {ticks.map((tick, i) => {
      const x = typeof tick === 'string' ? scale(tick) + scale.rangeBand()/2 : scale(tick)
      return (
        <g key={i}>
          <text textAnchor="end" transform={'translate(' + x + ',' + (y + tick_width + 10) + ') rotate(-45)'}>
            {tickFormatter(ticks, scale)(tick)}
          </text>
          <line
            y1={y}
            x1={x}
            y2={y + tick_width}
            x2={x}
          />
        </g>
      )
    })}
  </g>
)
export default XAxis