import React, { Component } from 'react';
import * as d3 from 'd3';
import Line from './line';
import Scatter from './scatter';
import PlotCanvas from '../plot_canvas';
import { seriesVars } from '../../../selectors/plot_selector';

export const XYConfig = {
  name: 'xy',
  label: 'XY Plot',
  computed: {
    xdomain: plot_series => {
      let all_x = seriesVars(plot_series, 'x').join(', ');
      return `[ min( concat( ${all_x})), max( concat( ${all_x})) ]`;
    },
    ydomain: plot_series => {
      let all_y = seriesVars(plot_series, 'y').join(', ');
      return `[ min( concat( ${all_y})), max( concat( ${all_y})) ]`;
    }
  },
  series_types: {
    line: {
      variables: { x: 'expression', y: 'expression', color: 'color_type' },
      component: Line
    },
    scatter: {
      variables: { x: 'expression', y: 'expression', color: 'color_type' },
      component: Scatter
    }
  }
};

const SeriesComponent = ({ series, ...props}) => {
  let Component = SERIES_COMPONENTS[series.series_type];
  return (
    Component && <Component
      series={series}
      {...props}
    />
  );
};

export default class XYPlot extends Component {
  render() {
    let { parent_width, layout, data } = this.props;
    let { xdomain, ydomain, plot_series } = data;

    if (!xdomain || !ydomain) return null;

    return (
      <div>
        <PlotCanvas
          component={ SeriesComponent }
          layout={ layout }
          parent_width={ parent_width }
          xdomain={ xdomain.values }
          ydomain={ ydomain.values }
          plot_series={ plot_series }
        />
      </div>
    );
  }
}
