import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from '../../axis';
import Boxes from './boxes'

class BoxGraph extends Component{
  constructor(props){
    super(props);
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
  }

  render(){
    let {parent_width, plot, groups}=this.props;
    let {margin, y_min_max, color_range} = plot;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, 300),
      height: plot.height};

    // scaleBand type
    let xScale = this.xScale
      .padding(.8)
      .domain(groups.map(group => group.label))
      .range([margin.left, svg_dimensions.width - margin.right]);
  
    // scaleLinear type
    let yScale = this.yScale      
      .domain(y_min_max)
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

    let box_props = {
      groups,
      y_min_max, 
      color_range,
      scales: {xScale, yScale}
    };

    return(
      <div>
        <svg {...svg_props}>
          <Axis {...axis_x_props}/>
          <Axis {...axis_y_props}/>
          <Boxes {...box_props} />
        </svg>
     </div>
    );
  }
}

export default BoxGraph;
