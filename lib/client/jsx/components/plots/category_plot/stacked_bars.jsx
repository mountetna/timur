import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';
import { seriesLegend } from '../../../plots/plot_config';

const validPoint = (label,value) => label != null && value != null

class StackedBars extends Component {
  render(){
    let { series, xScale, yScale, width, offset } = this.props;
    let { variables: { category, subcategory, value, color } } = series;

    let legend = seriesLegend('category', series.series_type)(series);
    let subcategory_names = legend.map(({name})=>name);
    let colorMap = legend .reduce((map,{name,color}) => {
        map[name] = color; return map;
      }, {});

    let category_names = [ ...new Set(category.values) ];
    let stacked_bars = category_names.map(category_name => {
      let indexes = category.which(c => c == category_name).filter(i=>i!=null);

      return <StackedBar
        key={category_name}
        category_names={subcategory_names}
        category={ subcategory(indexes) }
        yScale={ yScale }
        x={ xScale(category_name)+ offset + width / 2 }
        values={ value(indexes) }
        width={ width }
        colorMap={ colorMap }
        />;
    });
    return <g className='stacked-bar-series'>{stacked_bars}</g>;
  }
}

class StackedBar extends Component {
  render() {
    let { category_names, category, values, x, yScale, width, colorMap } = this.props;

    let prev_height = 0;
    let bars = category_names.map(
      (category_name, i) => {
        let index = category.indexOf(category_name);

        if (!validPoint(category[index], values[index])) return null;

        let y = yScale(values[index] + prev_height);

        prev_height += values[index];

        return <rect
          key={category_name}
          x={ x }
          y={ y }
          width={ width }
          height={ yScale.range()[0]-yScale(values[index]) }
          fill={ colorMap[category_name] }
        />
      }
    );

    return <g className='stacked-bar-series'>{bars}</g>;
  }
};

export default StackedBars;
