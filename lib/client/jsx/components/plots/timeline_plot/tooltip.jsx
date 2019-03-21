import * as React from 'react';

export class Tooltip extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      text_offset: 18
    };
  }

  displayValues(){
    return this.props.data.map((datum, index)=>{
      let tspan_props = {
        x: this.state.text_offset,
        y: 3 + ((index + 1) * this.state.text_offset),
        key: `data-${index}`,
        className: 'tooltip-text',
        textAnchor: 'start'
      };

      return <text {...tspan_props}>{datum}</text>;
    });
  }

  render(){
    if(!this.props.display) return null;

    let {data, location} = this.props;
    let {x, y} = location;
    let height = (data.length + 1) * this.state.text_offset;
    let width = 280;

    let x_val = (x - width / 2);
    let y_val = (Math.round(y) + 20);
    let transform_arrow = `translate(${width / 2 - 20}, 1) rotate(180, 20, 0)`;

    if(height < y){
      y_val = (y - height - 20);
      transform_arrow = `translate(${width / 2 - 20}, ${height - 1})`;
    }
    let transform = `translate(${x_val}, ${y_val})`;

    let rect_props = {
      className: 'tooltip-bg',
      height: height,
      width: width
    };

    let polygon_props = {
      className: 'tooltip-arrow',
      points: '10,0  30,0  20,10',
      transform: transform_arrow
    };

    return(
      <g transform = {transform}>

        <rect {...rect_props} />
        <polygon {...polygon_props}/>
        {this.displayValues()}
      </g>
    );
  }
};
