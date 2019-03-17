import React, {Component} from 'react';
import { flatten } from '../../../utils/types';
import * as d3 from 'd3';
import Bars from './bars';
import StackedBars from './stacked_bars';
import Boxes from './boxes';
import Swarms from './swarms';
import PlotCanvas from '../plot_canvas';
import { seriesVars, varName } from '../../../selectors/plot_selector';

export const CategoryConfig = {
  name: 'category',
  label: 'Category Plot',
  variables: {
    category_label: { type: 'string', required: true },
    value_label: { type: 'string', required: true },
    value_min: { type: 'number', required: false },
    value_max: { type: 'number', required: false }
  },
  computed: {
    domain: plot_series => {
      let all_values = seriesVars(plot_series, 'value').join(', ');
      return `[ min( concat( ${all_values})), max( concat( ${all_values})) ]`;
    }
  },

  series_types: {
    bar: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        color: { type: 'color', required: false }
      },
      component: Bars
    },
    stackedbar: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        subcategory: { type: 'expression', required: true },
        color: { type: 'color', required: false }
      },
      component: StackedBars
    },
    box: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      },
      component: Boxes
    },
    swarm: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      },
      component: Swarms
    }
  }
};

export const categoryGroups = (category, value, groupFunc)=>{
  let category_names = [...new Set(category.values)];

  return category_names.map((category_name, index)=>{
    let indexes = category.which(c => c == category_name).filter(i=>i!= null);
    let category_values = value(indexes).filter(i=>i!=null).sort((a,b)=>a-b);
    return groupFunc(category_name, category_values);
  });
};

const SeriesComponent = ({ series, index, count, xScale, ...props}) => {
  let { component: Component } = CategoryConfig.series_types[series.series_type] || {};

  // the basic width cuts the bandwidth into even strips for each series

  let gutter_size = 8;
  let gap_size = 4;
  let width = Math.max(
    4,
    xScale.bandwidth() / count - (gap_size * (count-1) + 2*gutter_size)/ count
  );
  let offset = gutter_size + (width + gap_size) * index;
  return (
    Component && <Component
      xScale={xScale}
      width={width}
      offset={offset}
      series={series}
      { ...props }
    />
  );
}

export default class CategoryPlot extends Component{
  constructor(props){
    super(props);
    this.xScale = d3.scaleBand();
  }

  scale(axis) {
    return axis.values[0] instanceof Date ? d3.scaleTime() : d3.scaleLinear();
  }


  render(){

    let {parent_width, layout, data}=this.props;
    let { domain, plot_series } = data;

    let categories = flatten(plot_series.map(s => s.variables.category.values));

    if (!domain || !categories) return null;

    return(
      <PlotCanvas className='category-plot'
        component={ SeriesComponent }
        layout={ layout }
        parent_width={ parent_width }
        xdomain={ categories }
        ydomain={ domain.values }
        plot_series={ plot_series }
      />
    );
  }
}
