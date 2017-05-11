import React from 'react'
import { tickFormatter } from './utils/d3_scale.js'

const XAxis = ({ scale, num_ticks, tick_width, xmin, xmax, y, label }) => {
  const ticks = scale.ticks(num_ticks)
  const tickLabelFormatter = tickFormatter(ticks, scale)

  return (
    <g className="axis">
      <text textAnchor="middle" transform={ 'translate(' + (scale(xmin) + scale(xmax))/2 + ',' + (y + 35) + ')'}>
        {label}
      </text>
      <line
        y1={y}
        x1={scale(xmin)}
        y2={y}
        x2={scale(xmax)}
      />
      {ticks.map((tick,i) => {
        const x = scale(tick)
        return (
          <g key={i}>
            <text textAnchor="end" transform={'translate(' + x + ',' + (y + tick_width + 10) + ') rotate(-45)'}>
              {tickLabelFormatter(tick)}
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
}

export default XAxis