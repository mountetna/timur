import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from '../../axis';
import Bars from './bars';
//import Tooltip from '../../tooltip';

class BarGraph extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: [],
      // tooltip: {display: false, data: {key: '',value: ''}}
    };
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    // this.showToolTip = this.showToolTip.bind(this);
    // this.hideToolTip = this.hideToolTip.bind(this);
  }

  static getDerivedStateFromProps(next_props, prev_state){
    let {data} = next_props;
    if(next_props.data.length <= 0 ) return null;
    return {data}
  }

  showToolTip(event){
    let {target} = event;
    this.setState({tooltip:{
      display: true,
      data: {
          type: target.getAttribute('data-type'),
          value: target.getAttribute('data-value')
          },
      location:{
          x: parseFloat(target.getAttribute('width')) / 2 + 
              parseFloat(target.getAttribute('x')),
          y: target.getAttribute('y')
      } 
    }});
  }

  hideToolTip(){
    this.setState({tooltip:{ display:false,data:{type:'',value:''}}});
  }

  render(){
    let {parent_width, plot}=this.props;
    let {margins, color_range} = plot;
    let svg_width = parent_width > 800 ? 800 : parent_width;
    let svg_dimensions = {
      width: Math.max(svg_width, plot.width),
      height: plot.height
    };

    let max_value = Math.max(...this.state.data.map(d => d.value));
    
    // scaleBand type
    let xScale = this.xScale
      .padding(0.5)
      .domain(this.state.data.map(d => d.id))
      .range([margins.left, svg_dimensions.width - margins.right]);
  
     // scaleLinear type
    let yScale = this.yScale      
      .domain([0, max_value])
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
      tickSize: svg_dimensions.height - margins.top - margins.bottom,
    };

    let axis_y_props = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svg_dimensions.width - margins.left - margins.right,
    };

    let bars_props = {
      scales: {xScale, yScale},
      margins,
      data: this.state.data,
      max_value,
      svg_dimensions,
      color_range
      // showToolTip: this.showToolTip,
      // hideToolTip: this.hideToolTip
    };

    let tooltip_props = {
      tooltip: this.state.tooltip, 
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value: 'Type', 
      y_value: 'Value'
    };

    return(
      <div>
        <svg {...svg_props}>
          <Axis {...axis_x_props}/>
          <Axis {...axis_y_props}/>
          <Bars {...bars_props}/>
          {/*<Tooltip {...tooltip_props}/>*/}
        </svg>
     </div>
    );
  }
}

export default BarGraph;