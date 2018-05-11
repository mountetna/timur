import React, {Component} from 'react';
import {scaleBand, scaleLinear} from 'd3-scale';
import Axes from '../Axes';
import Bars from '../bars';
import Tooltip from '../tooltip';

class BarGraph extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      tooltip: {display: false, data: {key: '',value: ''}}
    };
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  componentWillReceiveProps(next_props){
    let {data} = next_props;
    this.setState({
      data
    });
  }

  showToolTip(event) {
    let {target} = event;
    this.setState({tooltip:{
      display:true,
      data: {
          type:target.getAttribute('data-type'),
          value:target.getAttribute('data-value')
          },
      location:{
          x: parseFloat(target.getAttribute('width')) / 2 + 
              parseFloat(target.getAttribute('x')),
          y: target.getAttribute('y')
      } 
    }});
  }

  hideToolTip(event) {
    this.setState({tooltip:{ display:false,data:{type:'',value:''}}});
}

  removeClick(event){
    event.preventDefault();
    this.setState((prev_state)=>{
      let data = [...prev_state.data];
      data.pop();
      return {data};
    });
  }

  render() {
    const margins = {top: 50, right: 50, bottom: 100, left: 60};
    const {parent_width}=this.props;
    const svg_width = parent_width > 800 ? 800 : parent_width;
    const svg_dimensions = {
      width: Math.max(svg_width, 300),
      height: 500};

    const max_value = Math.max(...this.state.data.map(d => d.value));
    
    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
      .domain(this.state.data.map(d => d.id))
      .range([margins.left, svg_dimensions.width - margins.right]);
  
     // scaleLinear type
    const yScale = this.yScale      
      .domain([0, max_value])
      .range([svg_dimensions.height - margins.bottom, margins.top]);

    let svg_props = {
      width: svg_dimensions.width,
      height: svg_dimensions.height
    }

    let axes_props = {
      scales: { xScale, yScale },
      margins,
      svg_dimensions
    };

    let bars_props = {
      scales: { xScale, yScale },
      margins,
      data: this.state.data,
      max_value,
      svg_dimensions,
      showToolTip: this.showToolTip,
      hideToolTip: this.hideToolTip
    }

    let tooltip_props = {
      tooltip: this.state.tooltip, 
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value: 'Type', 
      y_value: 'Value'
    }

    let remove_props = {
      onClick: this.removeClick.bind(this)
    };

    return (
      <div>
        <svg {...svg_props}>
          <Axes {...axes_props}/>
          <Bars {...bars_props}/>
          <Tooltip {...tooltip_props}/>
        </svg>
        <button {...remove_props}>Remove</button>
     </div>
    )
  }
}

export default BarGraph;