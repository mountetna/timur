import Dendrogram from './dendrogram';
import React, { Component } from 'react';

var DendrogramPlot = React.createClass({
  render: function() {
    var self = this
    var plot = this.props.plot
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    if (!this.props.data) return <div></div>

    return <svg 
        className="dendrogram_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } 
          y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
          <Dendrogram tree={ new Tree(this.props.data) } height={ canvas_height } width={ canvas_width }/>
        </PlotCanvas>
      </svg>;
  },
})

module.exports = DendrogramPlot
