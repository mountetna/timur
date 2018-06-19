import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from './axis';
import TimelineEvents from './timeline_events';
import Tooltip from './tooltip';

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
    if(next_props.all_events.length <= 0 ) return null;
    
    // Set start and end date for timeline axis.
    let min =  next_props.all_events[0].start ? 
      new Date(next_props.all_events[0].start) : null;

    let max =  next_props.all_events[0].end ? 
      new Date(next_props.all_events[0].end) : min;

    for(let i = 1; i < next_props.all_events.length; i++) {
      let start_time = next_props.all_events[i].start ? 
        new Date (next_props.all_events[i].start) : null;

      let end_time = next_props.all_events[i].end ? 
        new Date(next_props.all_events[i].end) : start_time;

      if(start_time < min){min = start_time;} 
      if(end_time > max){max = end_time;}
    }

    let current_date = new Date();
    if(max > current_date){
      max = current_date;
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
    let cir_y = parseFloat(target.getAttribute('cy'));

    this.setState({
      tooltip:{
        display:true,
        data: {
          type: target.getAttribute('data-type'),
          start: target.getAttribute('data-start'),
          end: target.getAttribute('data-end'),
          value: target.getAttribute('data-value') || null
        },
        location:{ 
          x: target.getAttribute('x') ? rec_x : cir_x,
          y: target.getAttribute('y') ? rec_y : cir_y
        } 
      }
    });
  }

  hideToolTip() {
    this.setState({
      tooltip:{ 
        display:false,
        data:{
          type:'',value:''
        }
      }
    });
  }

  render() {
    if(this.state.timeDomain.length < 1) return null;
    let {timeDomain, data} = this.state;
    let margins = { top: 41, right: 145, bottom: 440, left: 145 };
    let svg_dimensions = { 
      width: Math.max(this.props.parent_width, 500),
      height: data.length * 24 + 481
    };

    let svg_props = {
      width: svg_dimensions.width,
      height: svg_dimensions.height
    };
    
    //Create time scale.
    let xScale = this.timeScale
      .domain(timeDomain)
      .range([margins.left, svg_dimensions.width - margins.right])
      .nice();
    
    let yScale = this.bandScale
      .padding(0.5)
      .domain(data.map(datum => datum.label))
      .range([svg_dimensions.height - margins.bottom, margins.top]);

    let xProps = {
      orient: 'timeline-bottom',
      scale: xScale,
      translate: `translate(0, ${svg_dimensions.height - margins.bottom})`,
      tickSize: svg_dimensions.height - margins.top - margins.bottom,
    };
    
    let yProps = {
      orient: 'ordinal-left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svg_dimensions.width - margins.left - margins.right,
    };

    let events_props = {
      scales: { xScale, yScale },
      margins,
      data: this.state.data,
      svg_dimensions,
      showToolTip: this.showToolTip,
      hideToolTip: this.hideToolTip,
      color: this.props.color
    };

    let tooltip_props = {
      tooltip: this.state.tooltip, 
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value: 'Type', 
      y_value: 'Value'
    };

    return(
      <svg {...svg_props}>
        <Axis {...xProps} />
        <Axis {...yProps} />
        <TimelineEvents {...events_props} />
        <Tooltip {...tooltip_props}/>
      </svg>
    );
  }
}

export default TimelinePlot;