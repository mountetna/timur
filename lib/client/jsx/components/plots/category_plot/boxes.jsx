import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';
import { categoryGroups } from './category_plot';

let quantile = (values, p) => {
  if ( p == 0.0 ) { return values[ 0 ] }
  if ( p == 1.0 ) { return values[ values.length-1 ] }
  var id = values.length*p- 1
  if ( id == Math.floor( id ) ) {
    return ( values[ id ] + values[ id+1 ] ) / 2.0
  }
  id = Math.ceil( id )
  return values[ id ]
};

const boxData = (category_name, values) => {
  let quartile_data = [
    quantile(values, 0.25),
    quantile(values, 0.5),
    quantile(values, 0.75)
  ];

  values = values.filter(v=>v!==null);

  let iqr = (quartile_data[2] - quartile_data[0]) * 1.5;

  let whisker_min = values.find(v => v >= quartile_data[0] - iqr);
  let whisker_max = values.reverse().find(v => v <= quartile_data[2] + iqr);
  let outliers = values.filter(v => v < whisker_min  || v > whisker_max);

  return {
    category_name,
    values,
    inliers: { quartile_data, whisker_min, whisker_max },
    outliers
  };
}

const Outlier = ({x,y,outlier, text_position, color}) =>
  <g className='outlier'>
    <circle
      r='2'
      cx={ x }
      cy={ y }
      fill={ color }
      stroke='none'
    />
    <text textAnchor='start' x={ text_position + 4 } y={y} >{outlier.toFixed(2)}</text>
  </g>;

const Whisker = ({x, y_min, y_max, color}) => <line
        x1={ x }
        x2={ x }
        y1={ y_max }
        y2={ y_min }
        stroke={ color }
        strokeWidth='0.5'
      />;

const Box = ({x,y,width,height,color}) => <rect
  x={ x - width/2 }
  y={ y }
  height={ height }
  width={ width }
  fill={ color }
  stroke={ color }
/>;

const WhiskerTip = ({x,y,width,color}) =><line
  x1={ x - (width / 2) }
  x2={ x + (width / 2) }
  y1={ y }
  y2={ y }
  stroke={ color }
/>;

const WhiskerText = ({x,q,scale,anchor}) =>
  <text textAnchor={anchor} x={x + (anchor=='start' ? 2 : -2)} y={scale(q)}>{q.toFixed(2)}</text>;

const DEFAULT_COLOR = '#333333';
class Boxes extends Component{
  render(){
    let { series, xScale, yScale, offset, width, color } = this.props;
    let { variables: { category, value, label } } = series;


    if (category.size != value.size) return null;

    let groups = categoryGroups(category, value, label, boxData);

    let boxes = groups.map( (group,index_group) => {

      let { category_name, values, inliers } = group;
      let { whisker_min, whisker_max, quartile_data } = inliers;


      if (!values.length) return null;

      let x_position = xScale(category_name) + width / 2 + offset;
      let text_position = xScale(category_name) + offset;

      let median = yScale(quartile_data[1]);
      let y_min_scale = yScale(whisker_min);
      let y_max_scale = yScale(whisker_max);

      let boxwidth = Math.max(4,Math.min(width,20))

      return(
        <g key={index_group}>
          <g className='box-group'>
            <Whisker
              x={ x_position }
              color={color}
              y_min={ y_min_scale }
              y_max={ y_max_scale }/>

            <Box
              x={ x_position }
              y={ yScale(quartile_data[2]) }
              height={ yScale(quartile_data[0]) - yScale(quartile_data[2]) }
              width={ boxwidth }
              color={ color }
            />

            <WhiskerTip color={color} x={ x_position } width={ boxwidth } y={ y_max_scale }/>
            <WhiskerTip color={color} x={ x_position } width={ boxwidth } y={ median }/>
            <WhiskerTip color={color} x={ x_position } width={ boxwidth } y={ y_min_scale }/>

            <WhiskerText x={text_position+width} anchor='start' q={quartile_data[2]} scale={yScale}/>
            <WhiskerText x={text_position+width} anchor='start' q={quartile_data[1]} scale={yScale}/>
            <WhiskerText x={text_position+width} anchor='start' q={quartile_data[0]} scale={yScale}/>

            <WhiskerText x={text_position} anchor='end' q={whisker_min} scale={yScale}/>
            <WhiskerText x={text_position} anchor='end' q={whisker_max} scale={yScale}/>
          </g>
          <g className='outlier-group'>
          {
            group.outliers.map( (outlier, index) =>
              <Outlier
                x={ x_position }
                y={ yScale(outlier) }
                outlier={ outlier }
                color={ color }
                text_position={ x_position }
                key={ `outlier_${index}` }/>
            )
          }
          </g>
        </g>
      );
    });

    return <g className='box-series' key={'boxes'}>{boxes}</g>;
  }
}

export default Boxes;
