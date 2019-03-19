import React, { Component } from 'react';
import * as d3 from 'd3';
import Line from './line';
import Scatter from './scatter';
import PlotCanvas from '../plot_canvas';
import { empty, validDomain } from '../plot';

const COMPONENTS = {
  line: Line,
  scatter: Scatter
};

const SeriesComponent = ({ series, ...props}) => {
  let Component = COMPONENTS[series.series_type];

  return (
    Component && <Component
      series={series}
      {...props}
    />
  );
};

export default class XYPlot extends Component {
  render() {
    let { parent_width, layout, config_variables={}, data } = this.props;
    let { xdomain, ydomain, plot_series } = data;
    let { xmin, xmax, ymin, ymax } = config_variables;

    if (!xdomain || !ydomain) return null;

    return (
      <PlotCanvas
        className='xy-plot'
        component={ SeriesComponent }
        layout={ layout }
        parent_width={ parent_width }
        xdomain={ validDomain(xmin,xmax,xdomain) }
        ydomain={ validDomain(ymin,ymax,ydomain) }
        plot_series={ plot_series }
      />
    );
  }
}
