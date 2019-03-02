import React, { Component } from 'react';
import * as d3 from 'd3';
import Line from './line';
import Scatter from './scatter';
import PlotCanvas from '../plot_canvas';

const SERIES_COMPONENTS = {
  line: Line,
  scatter: Scatter
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
