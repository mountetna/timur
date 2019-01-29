
import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

const DEFAULT_COLOR = '#333333';
class Boxes extends Component{
  render(){
    let {y_min_max, groups, scales, color_range} = this.props;
    let {xScale, yScale} = scales;

    let colorScale = d3.scaleLinear()
      .domain(y_min_max)
      .range(color_range)
      .interpolate(interpolateLab);

    let boxes = groups.map( (group,index_group) => {
      let bar_height = yScale(group.inliers.quartile_data[0]) 
        - yScale(group.inliers.quartile_data[2]);
      let width = xScale.bandwidth();
      let x_position = xScale(group.label) + (xScale.bandwidth() / 2);
      let median = yScale(group.inliers.quartile_data[1]);
      let y_min_scale = yScale(group.inliers.whisker_min);
      let y_max_scale = yScale(group.inliers.whisker_max);

      let outliers = group.outliers.map((outlier, index) => {

        let outlier_props = {
          key: `outlier_${index}`,
          r: 3,
          cx: x_position,
          cy: yScale(outlier),
          stroke: DEFAULT_COLOR,
          fill: 'none'
        };

        let outlier_text_priops = {
          key: `outlier_${index}_xy`,
          x: xScale(group.label) - (2 * width),
          y: yScale(outlier)
        };

        return [
          <circle {...outlier_props} />, 
          <text {...outlier_text_priops}>{outlier.toFixed(2)}</text>
        ];
      });

      let whisker_props = {
        key: `${group.label}_stem`,
        x1: x_position,
        x2: x_position,
        y1: y_max_scale,
        y2: y_min_scale,
        stroke: DEFAULT_COLOR,
        'strokeDasharray': '5, 5',
        'strokeWidth': '0.5'
      };

      let whisker_lower_props = {
        key: `${group.label}_whisker_lower`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: y_min_scale ,
        y2: y_min_scale ,
        stroke: DEFAULT_COLOR
      };

      let median_props = {
        key: `${group.label}_median`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: median,
        y2: median,
        stroke: DEFAULT_COLOR
      };

      let whisker_upper_props = {
        key: `${group.label}_whisker_upper`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: y_max_scale,
        y2: y_max_scale,
        stroke: DEFAULT_COLOR
      };

      let rect_props = {
        key: group.label,
        x: xScale(group.label),
        y: yScale(group.inliers.quartile_data[2]),
        height: bar_height,
        width: xScale.bandwidth(),
        fill: colorScale(group.inliers.quartile_data[1]),
        stroke: colorScale(group.inliers.quartile_data[2])
      };

      let upper_quartile_props = {
        key: `${group.label}_upper_qt`,
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[2])
      };

      let median_quartile_props = {
        key: `${group.label}_mid_qt`,
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[1])
      };

      let lower_quartile_props = {
        key: `${group.label}_lower_qt`,
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[0])
      };

      let whisker_min_props = {
        key: `${group.label}_whisker_min`,
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.whisker_min)
      };

      let whisker_max_props = {
        key: `${group.label}_whisker_max`,
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.whisker_max)
      };

      return(
        <g className='box-group' key={index_group}>

          <line {...whisker_props} />
          <rect {...rect_props} />
          <line {...whisker_upper_props} />
          <line {...median_props} />
          <line {...whisker_lower_props} />
          <text {...upper_quartile_props}>{group.inliers.quartile_data[2].toFixed(2)} </text>
          <text {...median_quartile_props}>{group.inliers.quartile_data[1].toFixed(2)} </text>
          <text {...lower_quartile_props}>{group.inliers.quartile_data[0].toFixed(2)}</text>
          <text {...whisker_min_props}>{group.inliers.whisker_min.toFixed(2)} </text>
          <text {...whisker_max_props}>{group.inliers.whisker_max.toFixed(2)}</text>
          {outliers}
        </g>
      );
    });

    return <g key={'boxes'}>{boxes}</g>;
  }
}

export default Boxes;