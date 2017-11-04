import React, { Component } from 'react';

import XAxis from './xaxis'
import YAxis from './yaxis'
import * as d3 from "d3"

var ScatterPlot = React.createClass({
  render: function() {
    var self = this;

    if (!this.props.data || !this.props.data.length) return <div></div>;

    var plot = this.props.plot;
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    var all_series = this.props.data;

    var x_label = all_series[0].matrix.row_name(0);
    var y_label = all_series[0].matrix.row_name(1);

    var xmin = d3.min(all_series, function(series) { return d3.min(series.matrix.row(0)); });
    var xmax = d3.max(all_series, function(series) { return d3.max(series.matrix.row(0)); });
    var ymin = d3.min(all_series, function(series) { return d3.min(series.matrix.row(1)); });
    var ymax = d3.max(all_series, function(series) { return d3.max(series.matrix.row(1)); });

    var xScale = d3.scale.linear().domain([ xmin, xmax ]).range([0,canvas_width]);
    var yScale = d3.scale.linear().domain([ ymin, ymax ]).range([canvas_height,0]);

    return <svg 
        className="scatter_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
        <YAxis x={ 0 }
          scale={ yScale }
          label={ y_label }
          ymin={ ymin }
          ymax={ ymax }
          num_ticks={5}
          tick_width={ 5 }/>
        <XAxis
          label={ x_label }
          y={ canvas_height }
          scale={ xScale }
          xmin={ xmin }
          xmax={ xmax }
          num_ticks={ 5 }
          tick_width={ 5 } />
      <Legend x={ plot.width - margin.left - margin.right + 15 } y="0" series={ all_series }/>
        {
          all_series.map(function(series,i) {
            return <g key={self.props.data_key + series.name}>
            {
              series.matrix.map_col(function(point,j,name) {
                return <a key={self.props.data_key + name} xlinkHref={ Routes.browse_model_path('sample', name) }>
                    <circle className="dot"
                      r="2.5"
                      style={ {
                        fill: series.color
                      } }
                      cx={ xScale(point[0]) }
                      cy={ yScale(point[1]) }
                      />
                  </a>;
              })
            }
            </g>;
          })
        }
        </PlotCanvas>
      </svg>;
  }
});

module.exports = ScatterPlot;
