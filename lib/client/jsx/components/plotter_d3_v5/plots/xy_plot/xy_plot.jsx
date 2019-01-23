import React, { Component } from 'react';
import * as d3 from 'd3';
import Line from './line';
import Scatter from './scatter';
import Axis from '../../axis';
import Legend from '../../legend';

export default class XYPlot extends Component {
  scale(axis) {
    return axis.values[0] instanceof Date ? d3.scaleTime() : d3.scaleLinear();
  }

  seriesComponent({ series, index, xScale, yScale, color }) {
    let Component;
    switch (series.series_type) {
      case 'line':
        Component = Line;
        break;
      case 'scatter':
        Component = Scatter;
        break;
      default:
        return null;
    }
    return (
      <Component
        xScale={xScale}
        yScale={yScale}
        key={index}
        series={series}
        color={color}
      />
    );
  }

  render() {
    let { parent_width, layout, data } = this.props;
    let { xdomain, ydomain, plot_series } = data;
    let { margin, height } = layout;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, 300),
      height
    };

    if (!xdomain || !ydomain) return null;

    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let labels = plot_series.map(series => {
      return {
        color: color(series.name),
        text: series.name
      };
    });

    // Create time scale.

    let xScale = this.scale(xdomain)
      .domain(xdomain.values)
      .range([margin.left, svg_dimensions.width - margin.right])
      .nice();

    // scaleLinear type
    let yScale = this.scale(ydomain)
      .domain(ydomain.values)
      .range([svg_dimensions.height - margin.bottom, margin.top])
      .nice();

    let svg_props = {
      width: svg_dimensions.width,
      height: svg_dimensions.height
    };

    let axis_x_props = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svg_dimensions.height - margin.bottom})`,
      tickSize: svg_dimensions.height - margin.top - margin.bottom
    };

    let axis_y_props = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margin.left}, 0)`,
      tickSize: svg_dimensions.width - margin.left - margin.right
    };

    return (
      <div>
        <Legend labels={labels} />
        <svg {...svg_props}>
          <Axis {...axis_x_props} />
          <Axis {...axis_y_props} />
          {plot_series.map((series, index) =>
            this.seriesComponent({
              series,
              index,
              xScale,
              yScale,
              color: labels[index].color
            })
          )}
        </svg>
      </div>
    );
  }
}
