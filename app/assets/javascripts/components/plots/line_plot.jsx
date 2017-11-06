import Legend from './legend';
import PlotCanvas from './plot_canvas';
import React, { Component } from 'react';

import { createScale } from '../../utils/d3_scale'
import XAxis from './xaxis'
import YAxis from './yaxis'

var LinePlot = React.createClass({
  render: function() {
    var self = this
    var plot = this.props.plot
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom
    var lines = this.props.lines

    var x_values = lines.reduce(
      (values, line) => values.concat(line.points.map( (point) => point.x )),
      []
    )

    var y_values = lines.reduce(
      (values, line) => values.concat(line.points.map( (point) => point.y )),
      []
    )

    var xmin = x_values.min()
    var xmax = x_values.max()

    var ymin = y_values.min()
    var ymax = y_values.max()


    var xScale = createScale(
      [ xmin, xmax ],
      [ 0, width ]
    )
    var yScale = createScale(
      [ ymin, ymax ],
      [ height, 0 ]
    )

    return <svg 
      id={ this.props.plot.name }
      className="bar_plot" 
      width={ plot.width }
      height={ plot.height } >
      <PlotCanvas
        x={ margin.left } y={ margin.top }
        width={ width }
        height={ height }>
      <YAxis x={ 0 }
        scale={ yScale }
        label={ this.props.ylabel }
        ymin={ ymin }
        ymax={ ymax }
        num_ticks={5}
        tick_width={ 5 }/>
      <XAxis
        label={ this.props.xlabel }
        y={ height }
        scale={ xScale }
        xmin={ xmin }
        xmax={ xmax }
        num_ticks={ 5 }
        tick_width={ 5 } />
      <Legend x={ width + 15 } y="0" 
        series={ 
          this.props.legend || lines.map(function(line) {
            return {
              name: line.label,
              color: line.color
            }
          })
        }/>
        {
          lines.map(function(line,i) {
            var path_text = line.points.map(function(point) {
              return xScale(point.x) + " " + yScale(point.y)
            }).join(" L ")

            return <g key={i}>
                <path className="line" d={ " M " + path_text } stroke={ line.color } strokeWidth={ 2 } fill="none" />
            </g>;
          })
        }
        </PlotCanvas>
    </svg>
  }
})

module.exports = LinePlot
