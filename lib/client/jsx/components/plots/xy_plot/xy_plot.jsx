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
    let { parent_width, layout, config_variables={}, data, plot } = this.props;
    let { xdomain, ydomain, plot_series } = data;
    let { x_label, y_label, x_min, x_max, y_min, y_max } = config_variables;

    if (!xdomain || !ydomain) return null;

    return (
      <PlotCanvas
        className='xy-plot'
        component={ SeriesComponent }
        plot={ plot }
        layout={ layout }
        xlabel={ x_label }
        ylabel={ y_label }
        parent_width={ parent_width }
        xdomain={ validDomain(x_min,x_max,xdomain) }
        ydomain={ validDomain(y_min,y_max,ydomain) }
        plot_series={ plot_series }
      />
    );
  }
}
