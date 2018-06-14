
import React, { Component } from 'react'

class Tooltip extends Component {
  render() {
    let visibility = 'hidden';
    let transform = '';
    let width = 290;
    let height;
    let transform_text = 'translate('+ width / 2 + ',' + 15 +')';
    let transform_arrow = '';

    let {tooltip, bg_style, text_style, x_value, y_value} = this.props;
    let { data } = tooltip; 
    let values;
 
    if(tooltip.display == true){
      let {x, y} = tooltip.location;
      visibility = 'visible';
      values = data.value ? JSON.parse(data.value).data : null;
      height = values ? values.length * 10 + 100 : 80;

      if(height < y - 20){
        transform='translate(' + (x - width / 2) + 
          ',' + (y - height - 20) + ')';

        transform_arrow='translate('+ (width / 2 - 20) + 
          ',' + (height - .2) +')';
      }
      else{
        transform = 'translate(' + (x - width / 2) + ',' + 
          (Math.round(y) + 20) + ')';

        transform_arrow = 'translate('+ (width / 2 - 20) +
          ','+ 0 +') rotate(180, 20, 0)';
      }
    }


    let rec_props = {
      className: bg_style,
      width,
      height,
      rx: "5",
      ry: "5",
      visibility
    }

    let polygon_props = {
      className: bg_style,
      points: '10,0  30,0  20, 10',
      transform: transform_arrow,
      visibility
    }

    let text_props = {
      visibility,
      transform: transform_text
    }

    let tspan_props = {
      x:'-135',
      className: text_style,
      textAnchor: 'start'
    }

    let  displayValues = (obj) => {
      return obj.map( (el, index) => {
          return(
            <tspan {...tspan_props} key={index} dy='18'>
              {el.name +' : '+ el.value}
            </tspan>
          );
      })
    }

    return (
      <g transform = {transform}>

        <rect {...rec_props}/>
        <polygon {...polygon_props}/>
        <text {...text_props}>
        
          <tspan {...tspan_props}>{x_value +' : '+ data.type}</tspan>
          <tspan {...tspan_props} dy="18">{'Start: '+ data.start}</tspan>
          <tspan {...tspan_props} dy="18">{'End: '+ data.end}</tspan>
          { 
            data.grade !== null && 
            <tspan {...tspan_props} dy="18">{'Grade: '+ data.grade}</tspan>
          }
          {values && displayValues(values)}
        </text>
      </g>
    );
  }
};

export default Tooltip;