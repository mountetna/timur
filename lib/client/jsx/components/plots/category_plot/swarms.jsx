import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';
import { categoryGroups } from './category_plot';

const Dots = (label, values) => ({label,values});

const Dot = ({x,y, text_position, color}) =>
  <g className='dot'>
    <circle
      r='2'
      cx={ x }
      cy={ y }
      fill={ color }
      stroke='none'
    />
    <text textAnchor='end' x={ text_position - 4 } y={y} ></text>
  </g>;

class Swarms extends Component{
  render(){
    let { series, xScale, yScale, offset, width } = this.props;
    let { variables: { category, value, color } } = series;


    if (category.size != value.size) return null;

    let groups = categoryGroups(category, value, Dots);
    console.log('======= groups ===========', groups);

    let swarms = groups.map( (group,index_group) => {

      let { label, values } = group;

      if (!values.length) return null;

      let x_position = xScale(label) + (width / 2) + offset;
      let text_position = xScale(label) + offset;

      return(
        <g className='swarm-group' key={index_group}>
        {
          values.map( (value, index) =>
            <Dot
              x={ x_position }
              y={ yScale(value) }
              color={ color }
              text_position={ x_position }
              key={ `dot_${index}` }/>
          )
        }
        </g>
      );
    });

    return <g className='box-series' key='swarms'>{swarms}</g>;
  }
}

export default Swarms;
