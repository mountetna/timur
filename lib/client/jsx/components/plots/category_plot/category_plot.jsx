import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from '../axis';
import Bars from './bars';
import Boxes from './boxes';

const SeriesComponent = ({ series, index, count, xScale, yScale }) => {
  let Component;
  switch (series.series_type) {
    case 'bar':
      Component = Bars;
      break;
    case 'box':
      Component = Boxes;
      break;
    default:
      return null;
  }
  let width = (xScale.bandwidth() - (4 * count-1))/ count;
  let offset = (width + 4) * index;
  return (
    <Component
      xScale={xScale}
      yScale={yScale}
      key={index}
      width={width}
      offset={offset}
      series={series}
    />
  );
}

export default class CategoryPlot extends Component{
  constructor(props){
    super(props);
    this.xScale = d3.scaleBand();
  }

  scale(axis) {
    return axis.values[0] instanceof Date ? d3.scaleTime() : d3.scaleLinear();
  }


  render(){
    let {parent_width, layout, data}=this.props;
    let {domain, plot_series} = data;
    let { margin, height } = layout;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, 300),
      height
    };

    let categories = [...new Set([].concat(...plot_series.map( s => s.variables.category.values)))];

    // scaleBand type
    let xScale = this.xScale
      .padding(.2)
      .domain(categories)
      .range([margin.left, svg_dimensions.width - margin.right]);
  
    // scaleLinear type
    let yScale = this.scale(domain)     
      .domain(domain.values)
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

    return(
      <div>
        <svg {...svg_props}>
          <Axis {...axis_x_props}/>
          <Axis {...axis_y_props}/>
          {plot_series.map((series, index) =>
            <SeriesComponent
              series={series}
              index={index}
              count={plot_series.length}
              xScale={xScale}
              yScale={yScale}
            />
          )}
        </svg>
     </div>
    );
  }
}
