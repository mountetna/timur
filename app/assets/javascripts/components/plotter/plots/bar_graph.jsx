import React, {Component} from 'react';
import {scaleBand, scaleLinear} from 'd3-scale';
import Axes from '../Axes';
import Bars from '../bars';

class BarGraph extends Component {
  constructor() {
    super()
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
  }

  render() {
    const data = [
      { title: 'Kidney', value: 21 },
      { title: 'Liver', value: 81 },
      { title: 'Large Intestine', value: 25 },
      { title: 'Small Intestine', value: 26 },
      { title: 'Stomach', value: 11 },
      { title: 'Heart', value: 44 },
      { title: 'Bladder', value: 0 },
      { title: 'Brain', value: 22 },
      { title: 'Gall Bladder', value: 51 },
      { title: 'Pancreas', value: 29 },
      { title: 'Adrenal Gland', value: 2 },
    ];
    const margins = {top: 50, right: 20, bottom: 100, left: 60}
    const {parent_width}=this.props;
    const svg_width = parent_width > 800 ? 800 : parent_width;
    const svg_dimensions = {
      width: Math.max(svg_width, 300),
      height: 500};

    const max_value = Math.max(...data.map(d => d.value));
    
    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d.title))
      .range([margins.left, svg_dimensions.width - margins.right]);
  
     // scaleLinear type
    const yScale = this.yScale      
      .domain([0, max_value])
      .range([svg_dimensions.height - margins.bottom, margins.top]);

    return (
      <svg width={svg_dimensions.width} height={svg_dimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svg_dimensions={svg_dimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          max_value={max_value}
          svg_dimensions={svg_dimensions}
        />
    </svg>
    )
  }
}

export default BarGraph;