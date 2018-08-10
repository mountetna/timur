import * as React from 'react';

class TimelineEvents extends React.Component{
  constructor(props){
    super(props);
    this.updateD3(props);
  }

  componentWillUpdate(next_props){
    this.updateD3(next_props);
  }

  updateD3(props){
    const {scales, zoom_transform} = props;
    const {xScale} = scales;

    if(zoom_transform){
      xScale.domain(zoom_transform.rescaleX(xScale).domain());
    }
  }

  processDate(str_date){
    let date = null;
    try{
      date = new Date(str_date);
      if(date.toUTCString() == 'Invalid Date') date = null;
    }
    catch(error){
      console.log(`'${datum.start}' is not a date.`);
    }

    return date;
  }

  renderRectangle(datum, color, text_props, start_date, end_date, index){

    let {showToolTip, hideToolTip} = this.props;
    let {xScale, yScale} = this.props.scales;

    let rect_width = xScale(end_date) - xScale(start_date);
    if(rect_width < 0) rect_width = 0;

    let rect_props = {
      key: `${datum.event_id}_${index}`,
      className: 'clip_path_obj',
      x: xScale(start_date),
      y: yScale(datum.event_id),
      height: yScale.bandwidth(),
      width: rect_width,
      fill: datum.color,
      'data-value':  JSON.stringify(datum),
      'data-patient-id': datum.patient_id,
      'data-type': datum.type,
      'data-start': datum.start || '',
      'data-end': datum.end || ''
    };

    rect_props['onMouseOver'] = (event)=>{
      if(this.props.showToolTip){
        this.props.showToolTip(event, datum, rect_props);
      }
    };

    rect_props['onMouseOut'] = (event)=>{
      if(this.props.hideToolTip){
        this.props.hideToolTip(event, datum, rect_props);
      }
    };

    return(
      <g key={`rect-group_${index}`}>

        <text {...text_props}>{`${datum.patient_id} ${datum.type}`}</text>
        <rect {...rect_props}/>
      </g>
    );
  }

  renderCircle(datum, color, text_props, start_date, index){

    let {showToolTip, hideToolTip} = this.props;
    let {xScale, yScale} = this.props.scales;

    let cir_props =  {
      key: `${datum.event_id}_${index}`,
      className: 'clip_path_obj',
      cx: xScale(start_date),
      cy: yScale(datum.event_id) + yScale.bandwidth() / 2,
      r:  yScale.bandwidth() / 2,
      fill: datum.color,
      'data-value': JSON.stringify(datum),
      'data-patient-id': datum.patient_id,
      'data-type': datum.type,
      'data-start': datum.start || '',
      'data-end': datum.end || ''
    };

    cir_props['onMouseOver'] = (event)=>{
      if(this.props.showToolTip){
        this.props.showToolTip(event, datum, cir_props);
      }
    };

    cir_props['onMouseOut'] = (event)=>{
      if(this.props.hideToolTip){
        this.props.hideToolTip(event, datum, cir_props);
      }
    };

    return(
      <g key={`cir-group_${index}`}>

        <text {...text_props} >{`${datum.patient_id} ${datum.type}`}</text>
        <circle {...cir_props}/>
      </g>
    );
  }

  get transform(){
    const {x, y} = this.props;
    return `translate(${x}, ${y})`;
  }

  render(){
    let {scales, data, color, showToolTip, hideToolTip} = this.props;
    let {xScale, yScale} = scales;

    let events = [];
    for(let index = 0; index < data.length; ++index){
      let datum = data[index];

      // Preprocess the dates to check for errors later.
      let start_date = this.processDate(datum.start);
      let end_date = this.processDate(datum.end);

      let text_props = {
        key: `text-${datum.event_id}_${index}`,
        className: 'label-text',
        alignmentBaseline: 'middle',
        x: '0',
        y: yScale(datum.event_id) + yScale.bandwidth() / 2,
      };

      // Check for an end date.
      if('end' in datum){
        if(start_date == null || end_date == null) continue
        events.push(
          this.renderRectangle(
            datum,
            color,
            text_props,
            start_date,
            end_date,
            index
          )
        );
      }
      else{
        if(start_date == null) continue;
        events.push(
          this.renderCircle(datum, color, text_props, start_date, index)
        );
      }
    }

    return <g transform={this.transform}>{events}</g>;
  }
}

export default TimelineEvents;
