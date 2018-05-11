import React, { Component } from 'react'

class Tooltip extends Component {
  render() {
    let visibility = "hidden";
    let transform = "";
    let width = 140;
    let height = 70;
    let transform_text = 'translate('+ width / 2 + ',' + (height / 2 - 5) +')';
    let transform_arrow = "";

    let {tooltip, bg_style, text_style, x_value, y_value} = this.props;
    let { data } = tooltip;
 
    if(tooltip.display == true){

        let {x, y} = tooltip.location;
        visibility = "visible";

        if(y > height){
            transform='translate(' + (x - width / 2) + 
                ',' + (y - height - 20) + ')';

            transform_arrow='translate('+ (width / 2 - 20) + 
                ',' + (height - .2) +')';

        }else if(y < height){
            transform = 'translate(' + (x - width / 2) + ',' + 
                (Math.round(y) + 20) + ')';

            transform_arrow = 'translate('+ (width / 2 - 20) +
                ','+ 0 +') rotate(180, 20, 0)';
        }

    }else{
      visibility = "hidden"
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

    let tspan_props ={
        x: "0",
        className: text_style,
        textAnchor: "middle"
    }

    return (
      <g transform = {transform}>

        <rect {...rec_props}/>
        <polygon {...polygon_props}/>
        <text {...text_props}>

          <tspan {...tspan_props}>{x_value +" : "+ data.type}</tspan>
          <tspan {...tspan_props} dy="25">{y_value +" : "+ data.value}</tspan>
        </text>
      </g>
    );
  }
};

export default Tooltip;