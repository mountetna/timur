import * as React from 'react';
import * as d3 from 'd3';
import Axis from '../../axis';
import TimelineEvents from './timeline_events';
import {Tooltip} from './tooltip';

class TimelineGraph extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      time_domain:[],
      data: [],
      tooltip: {display: false, data: {key: '',value: ''}},
      zoom_transform: null
    };

    this.timeScale = d3.scaleTime();
    this.bandScale = d3.scaleBand();
    this.zoom = d3.zoom();
  }

  static getDerivedStateFromProps(next_props, prev_state){
    if(next_props.all_events.length <= 0) return null;

    // Set start and end date for timeline axis.
    let min = null;
    if(next_props.all_events[0].start){
      min = new Date(next_props.all_events[0].start);
    }

    let max = null;
    if(next_props.all_events[0].end){
      max = new Date(next_props.all_events[0].end);
    }

    for(let a = 1; a < next_props.all_events.length; ++a){
      let start_time = null
      if(next_props.all_events[a].start){
        start_time = new Date (next_props.all_events[a].start);
      }

      let end_time = null;
      if(next_props.all_events[a].end){
        end_time = new Date(next_props.all_events[a].end);
      }

      if(start_time < min) min = start_time;
      if(end_time > max) max = end_time;
    }

    let current_date = new Date();
    if(max > current_date) max = current_date;

    if(max) max.setMonth(max.getMonth() + 3);
    if(min) min.setMonth(min.getMonth() - 3);

    return {
      time_domain: [min, max],
      data: next_props.all_events
    };
  }

  componentDidMount(){
    d3.select(this.refs.svg)
      .call(this.zoom);
  }

  componentDidUpdate(){
    d3.select(this.refs.svg)
      .call(this.zoom);
  }

  zoomed(){
    this.setState({
      zoom_transform: d3.event.transform
    });
  }

  processTooltipData(datum){
    return Object.keys(datum).map((key)=>{
      return `${key}: ${datum[key]}`;
    });
  }

  showToolTip(event, datum, config){
    let rec_x = (parseFloat(config.width) / 2) + parseFloat(config.x);
    let rec_y = parseFloat(config.y) + (parseFloat(config.height) / 2);

    let cir_x = parseFloat(config.cx);
    let cir_y = parseFloat(config.cy);

    this.setState({
      tooltip:{
        display:true,
        data: this.processTooltipData(datum),
        location: {
          x: config.x ? rec_x : cir_x,
          y: config.y ? rec_y : cir_y
        }
      }
    });
  }

  hideToolTip(event, datum, config){
    this.setState({
      tooltip:{
        display:false,
        data: []
      }
    });
  }

  render(){
    if(this.state.time_domain.length < 1) return null;
    let {time_domain, data, tooltip, zoom_transform} = this.state;
    let margins = {top: 41, right: 5, bottom: 100, left: 150};
    let svg_dimensions = {
      width: Math.max(this.props.parent_width, 500),
      height: data.length * 24 + 481
    };

    //Create time scale.
    let xScale = this.timeScale
      .domain(time_domain)
      .range([margins.left, svg_dimensions.width - margins.right])
      .nice();

    let yScale = this.bandScale
      .padding(0.5)
      .domain(data.map(datum => datum.event_id))
      .range([svg_dimensions.height - margins.bottom, margins.top]);

    this.zoom.scaleExtent([1, 100])
      .translateExtent([
        [0, 0],
        [svg_dimensions.width, svg_dimensions.height]
      ])
      .extent([
        [0, 0],
        [svg_dimensions.width, svg_dimensions.height]
      ])
      .on('zoom', this.zoomed.bind(this));

    let xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svg_dimensions.height - margins.bottom})`,
      tickSize: svg_dimensions.height - margins.top - margins.bottom,
      timeformat: "%b '%y"
    };

    let yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svg_dimensions.width - margins.left - margins.right
    };

    let events_props = {
      scales: {xScale, yScale},
      margins,
      data,
      svg_dimensions,
      showToolTip: this.showToolTip.bind(this),
      hideToolTip: this.hideToolTip.bind(this),
      color: this.props.color,
      zoom_transform,
      x: 0,
      y: 0
    };
/*
    let tooltip_props = {
      tooltip: tooltip,
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value1: 'Patient ID',
      x_value2: 'Type',
      y_value: 'Value'
    };
*/

    let rect_props = {
      className: 'zoom',
      width: svg_dimensions.width - margins.right - margins.left,
      height: svg_dimensions.height,
      transform: `translate(${margins.left}, ${margins.top})`
    };

    return(
      <svg {...svg_dimensions} ref='svg'>

        <Axis {...xProps} />
        <Axis {...yProps} />
        <clipPath id='clip'>

          <rect {...rect_props}  />
        </clipPath>
        <TimelineEvents {...events_props} />
        <Tooltip {...this.state.tooltip} />
      </svg>
    );
  }
}

export default TimelineGraph;
