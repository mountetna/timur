import React, {Component} from 'react';
import * as d3 from 'd3';
import Lines from './lines';
import Axis from '../../axis';
import Legend from '../../legend';

class LineGraph extends Component{
  constructor(props){
    super(props);
    this.timeScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
  }

  render(){
    let {parent_width, plot, lines}=this.props;
    let {margins, x_min_max, y_min_max} = plot;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, 300),
      height: plot.height
    };
    
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let labels = lines.map(line => {
      return {
        color: color(line.label),
        text: line.label
      };
    });

    // Create time scale.
    let xScale = this.timeScale
      .domain(x_min_max)
      .range([margins.left, svg_dimensions.width - margins.right])
      .nice();
  
     // scaleLinear type
    let yScale = this.yScale      
      .domain(y_min_max)
      .range([svg_dimensions.height - margins.bottom, margins.top])
      .nice();

    let svg_props = {
      width: svg_dimensions.width,
      height: svg_dimensions.height
    };

    let axis_x_props = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svg_dimensions.height - margins.bottom})`,
      tickSize: svg_dimensions.height - margins.top - margins.bottom
    };

    let axis_y_props = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svg_dimensions.width - margins.left - margins.right
    };

    let line_props = {
      lines,
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

export default LineGraph;