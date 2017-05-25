import React from 'react'
import { tickFormatter } from '../../utils/d3_scale.js'

const YAxis = ({ scale, num_ticks, tick_width, ymin, ymax, x = 0, label }) => {
  const ticks = scale.ticks(num_ticks)
  const tickLabelFormatter = tickFormatter(ticks, scale)

  return (
    <g className="axis">
      <text textAnchor="middle" transform={ 'translate(-45,' + (scale(ymin) + scale(ymax)) / 2 + ') rotate(-90)'}>
        {label}
      </text>
      <line
        x1={x}
        y1={scale(ymin) || 0}
        x2={x}
        y2={scale(ymax) || 0}
      />
      {ticks.map((tick,i) => {
        const y = scale(tick)
        return (
          <g key={i}>
            <text textAnchor="end" transform={'translate(' + (x - tick_width - 2) + ',' + (y + 2) + ')' }>
              {tickLabelFormatter(tick)}
            </text>
            <line
              x1={x}
              y1={y || 0}
              x2={x - tick_width}
              y2={y || 0}
            />
          </g>
        )
      })}
    </g>
  )
}

export default YAxis
