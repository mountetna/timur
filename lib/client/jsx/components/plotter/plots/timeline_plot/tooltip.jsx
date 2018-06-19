
import React, { Component } from 'react'

class Tooltip extends Component {
  render() {
    let visibility = 'hidden';
    let transform = '';
    let width = 290;
    let height;
    let transform_text = 'translate('+ width / 2 + ',' + 18 +')';
    let transform_arrow = '';

    let {tooltip, bg_style, text_style, x_value} = this.props;
    let {data} = tooltip; 
    let values;
 
    if(tooltip.display === true){
      let {x, y} = tooltip.location;
      let increment = 0;
      visibility = 'visible';
      values = data.value ? JSON.parse(data.value).data : null;

      values.forEach( obj => {
        let str = obj.name + obj.value;
        if( str.length > 52) {increment++}
      });
    
      height = values ? (values.length + increment) * 18 + 65 : 80;
    
      if(height < y - 18){
        transform='translate(' + (x - width / 2) + 
          ',' + (y - height - 20) + ')';

        transform_arrow='translate('+ (width / 2 - 20) + 
          ',' + (height - .2) +')';
      }
      else {
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
      rx: '5',
      ry: '5',
      visibility
    };

    let polygon_props = {
      className: bg_style,
      points: '10,0  30,0  20, 10',
      transform: transform_arrow,
      visibility
    };

    let text_props = {
      visibility,
      transform: transform_text
    };

    let tspan_props = {
      x:'-135',
      className: text_style,
      textAnchor: 'start'
    };

    let displayValues = (obj) => {
      return obj.map( (el, index) => {
        let str_len = `${el.name +': '+ el.value}`.length;
        if(str_len < 54){
          return (
            <tspan {...tspan_props} key={index} dy='18'>

              {el.name +': '+ el.value}
            </tspan>
          );
        }
        else {
            return ([
              <tspan {...tspan_props} key={index} dy='18'>

                {el.name +' :'}
              </tspan>, 
              <tspan {...tspan_props} key={index+'shift'} dy='18'>

                &#8627; {el.value}
              </tspan>
            ]);
        }
      })
    };

    return (
      <g transform = {transform}>

        <rect {...rec_props}/>
        <polygon {...polygon_props}/>
        <text {...text_props}>
        
          <tspan {...tspan_props}>{x_value +': '+ data.type}</tspan>
          <tspan {...tspan_props} dy='18'>{'Start: '+ data.start}</tspan>
          <tspan {...tspan_props} dy='18'>{'End: '+ data.end}</tspan>
          {values && displayValues(values)}
        </text>
      </g>
    );
  }
};

export default Tooltip;