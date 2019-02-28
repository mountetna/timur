
import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

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

const categoryGroups = (category, value)=>{
  let category_names = [...new Set(category.values)];

    return category_names.map((category_name, index)=>{

      let indexes = category.which(c => (c == category_name)).filter(i => (i!= null));

      let category_values = value(indexes).sort((a,b)=> a-b ).filter(i => i!=null);

      let quartile_data = [
        quantile(category_values, 0.25),
        quantile(category_values, 0.5),
        quantile(category_values, 0.75)
      ];

      let iqr = (quartile_data[2] - quartile_data[0]) * 1.5;

      let whisker_min = category_values.find(value => {
        return value >= quartile_data[0] - iqr && value !== null;
      });

      let whisker_max = category_values.reverse().find(value => {
        return value <= quartile_data[2] + iqr;
      });

      let outliers = category_values.filter(value => {
        return (value < whisker_min  || value > whisker_max) && value !== null;
      });

      return {
        label: category_name,
        values: category_values,
        inliers: {whisker_min, whisker_max, quartile_data},
        outliers
      };

    });
};

const Outlier = ({x,y,outlier, text_position, color}) =>
  <g className='outlier'>
    <circle
      r='2'
      cx={ x }
      cy={ y }
      fill={ color }
      stroke='none'
    />
    <text textAnchor='end' x={ text_position - 4 } y={y} >{outlier.toFixed(2)}</text>
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
  x={ x }
  y={ y }
  height={ height }
  width={ width }
  fill={ color }
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
    let { series, xScale, yScale, offset, width } = this.props;
    let { variables: { category, value, color } } = series;


    if (category.size != value.size) return null;

    let groups = categoryGroups(category, value);
    console.log('======= groups ===========', groups);

    let boxes = groups.map( (group,index_group) => {

      let { label, values, inliers } = group;
      let { whisker_min, whisker_max, quartile_data } = inliers;


      if (!values.length) return null;

      let x_position = xScale(label) + (width / 2) + offset;
      let text_position = xScale(label) + offset;

      let median = yScale(quartile_data[1]);
      let y_min_scale = yScale(whisker_min);
      let y_max_scale = yScale(whisker_max);

      return(
        <g>
          <g className='box-group' key={index_group}>
            <Whisker
              x={ x_position }
              color={color}
              y_min={ y_min_scale }
              y_max={ y_max_scale }/>

            <Box
              x={ x_position - (width / 2) }
              y={ yScale(quartile_data[2]) }
              height={ yScale(quartile_data[0]) - yScale(quartile_data[2]) }
              width={ width }
              color={ color }
            />

            <WhiskerTip color={color} x={ x_position } width={ width } y={ y_max_scale }/>
            <WhiskerTip color={color} x={ x_position } width={ width } y={ median }/>
            <WhiskerTip color={color} x={ x_position } width={ width } y={ y_min_scale }/>

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
