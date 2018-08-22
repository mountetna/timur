import React, {Component} from 'react';
import * as d3 from 'd3';
import Lines from './lines';
import Axis from '../../axis';
import Legend from '../../legend';

export default class LineGraph extends Component{
  constructor(props){
    super(props);
    this.timeScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
  }

  render(){
    let { parent_width, layout, data } = this.props;
    let { xdomain, ydomain, plot_series } = data;
    let { margin, height } = layout;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, 300),
      height
    };



    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let labels = plot_series.map(series => {
      return {
        color: color(series.name),
        text: series.name
      };
    });

    // Create time scale.
    let xScale = this.timeScale
      .domain(xdomain.values)
      .range([margin.left, svg_dimensions.width - margin.right])
      .nice();

     // scaleLinear type
    let yScale = this.yScale      
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

    let line_props = {
      lines: plot_series,
      scales: {xScale, yScale}
    };

    let legend_props = {
      labels,
    };

    return(
      <div>
        <Legend {...legend_props}/>
        <svg {...svg_props}>
          <Axis {...axis_x_props}/>
          <Axis {...axis_y_props}/>
          <Lines {...line_props}/>
        </svg>
     </div>
    );
  }
}
