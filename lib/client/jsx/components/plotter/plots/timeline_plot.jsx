import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from '../axis';
import Events from './events';
import Tooltip from '../tooltip';

class TimelinePlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeDomain:[],
      data: [],
      tooltip: {display: false, data: {key: '',value: ''}}
    };
    this.timeScale = d3.scaleTime();
    this.bandScale = d3.scaleBand();
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  static getDerivedStateFromProps(next_props, prev_state){
    if (next_props.all_events.length <=0 ) return null;
    
    // Set start and end date for timeline axis.
    let min =  next_props.all_events[0].start ? 
      new Date(next_props.all_events[0].start) : null;

    let max =  next_props.all_events[0].end ? 
      new Date(next_props.all_events[0].end) : min;

    for (let i = 1; i < next_props.all_events.length; i++) {
      let start_time = next_props.all_events[i].start ? 
        new Date (next_props.all_events[i].start) : null;

      let end_time = next_props.all_events[i].end ? 
        new Date(next_props.all_events[i].end) : start_time;

      if (start_time < min){min = start_time;} 
      if (end_time > max){max = end_time;}
    }

    return {
      timeDomain: [min, max],
      data: next_props.all_events
    };
  }

  showToolTip(event) {
    let {target} = event;

    let rec_x = parseFloat(target.getAttribute('width')) / 2 + 
      parseFloat(target.getAttribute('x'));

    let rec_y = parseFloat(target.getAttribute('y')) + 
      parseFloat(target.getAttribute('height')) / 2;

    let cir_x = parseFloat(target.getAttribute('cx'));
    let cir_y =  target.getAttribute('cy');

    this.setState({
      tooltip:{
        display:true,
        data: {
            type:target.getAttribute('data-type'),
            start:target.getAttribute('data-start'),
            end:target.getAttribute('data-end'),
            value:target.getAttribute('data-value')
            },
        location:{ 
            x: target.getAttribute('x') ? rec_x : cir_x,
            y: target.getAttribute('y') ? rec_y : cir_y
        } 
      }
    });
    console.log('===================== data value ========================')
    console.log(target.getAttribute('data-value'))
  }

  hideToolTip() {
    this.setState({
      tooltip:{ 
        display:false,
        data:{
          type:'',value:''
        }}});
  }

  render() {
    if (this.state.timeDomain.length < 1) return null;
    let margins = { top: 65, right: 90, bottom: 100, left: 110 };
    let svgDimensions = { 
      width: Math.max(this.props.parent_width, 500),
      height: 500
    };
    
    //Create time scale.
    const xScale = this.timeScale
      .domain(this.state.timeDomain)
      .range([margins.left, svgDimensions.width - margins.right]);
    
    const yScale = this.bandScale
      .padding(0.5)
      .domain(this.state.data.map(datum => datum.label))
      .range([svgDimensions.height - margins.bottom, margins.top]);

    let xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svgDimensions.height - margins.bottom})`,
      tickSize: svgDimensions.height - margins.top - margins.bottom,
    };
    
    let yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svgDimensions.width - margins.left - margins.right,
    };

    let events_props = {
      scales: { xScale, yScale },
      margins,
      data: this.state.data,
      svgDimensions,
      showToolTip: this.showToolTip,
      hideToolTip: this.hideToolTip
    };

    let tooltip_props = {
      tooltip: this.state.tooltip, 
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value: 'Type', 
      y_value: 'Value'
    };

    return(
      <svg width= {svgDimensions.width} height= {svgDimensions.height}>
        <Axis {...xProps} />
        <Axis {...yProps} />
        <Events {...events_props} />
        <Tooltip {...tooltip_props}/>
      </svg>
    );
  }
}

export default TimelinePlot;