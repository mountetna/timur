import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import Axes from '../Axes';
import Bars from '../bars';
import D3ResponsiveWrapper from '../d3ResponsiveWrapper';

class BarGraph extends Component {
  constructor() {
    super()
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
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
    const margins = { top: 50, right: 20, bottom: 100, left: 60 }
    const svgDimensions = {
      width: Math.max(this.props.parentWidth, 300),
      height: 500}


    const maxValue = Math.max(...data.map(d => d.value))
    
    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d.title))
      .range([margins.left, svgDimensions.width - margins.right])
  
     // scaleLinear type
    const yScale = this.yScale      
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top])

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
    </svg>
    )
  }
}

export default D3ResponsiveWrapper(BarGraph)