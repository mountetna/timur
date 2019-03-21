// Framework libraries.
import * as React from 'react';
import * as d3 from 'd3';
import Axis from './axis';
import Legend from './legend';
import { autoColors } from '../../utils/colors';
import { seriesLegend } from '../../plots/plot_config';

// The PlotCanvas renders the svg pane and determines
// its width, etc.


export default class PlotCanvas extends React.Component {
  scale(domain, range) {
    let s;

    if (domain[0] instanceof Date) {
      s = d3.scaleTime();
      s.type = 'time';
    } else if (typeof domain[0] === 'string') {
      s = d3.scaleBand().padding(.2);
      s.type = 'band';
    } else {
      s = d3.scaleLinear();
      s.type = 'linear';
    }

    s = s.domain(domain).range(range);
    if (s.nice) s = s.nice();

    return s;
  }

  render() {
    let { layout, parent_width, xdomain, ydomain, xlabel, ylabel,
      plot, plot_series, component, className, ...other_props } = this.props;
    let { margin } = layout;

    let defaultColor = d3.scaleOrdinal(autoColors(plot_series.length));

    let colors = plot_series.map(({name, variables: { color }}) => color || defaultColor(name));

    let labels = plot_series.map(
      (series, i) => {
        let legend = seriesLegend(plot.plot_type, series.series_type);
        let color = colors[i];

        return legend ? legend(series,color) : { color, name: series.name };
      }
    );

    let svg_dimensions = {
      width: Math.max(
          Math.min(
            layout.width || parent_width,
            1600
          ),
          300
        ),
      height: layout.height
    };


    let xScale = this.scale(xdomain, [ margin.left, svg_dimensions.width - margin.right ]);

    let yScale = this.scale(ydomain, [ svg_dimensions.height - margin.bottom, margin.top ]);

    let SeriesComponent = component;

    let xsize = svg_dimensions.width - margin.left - margin.right;
    let ysize = svg_dimensions.height - margin.top - margin.bottom;

    return <div className={ className }>
      <Legend width={ svg_dimensions.width } labels={labels} />
      <svg
        width={ svg_dimensions.width }
        height={ svg_dimensions.height }>
        { xlabel && <text x={xsize/2+parseInt(margin.left)}
          y={parseInt(margin.top) + ysize + 50}
          fontSize='12px'
          textAnchor='middle'>{xlabel}</text> }
        <Axis
          orient='Bottom'
          scale={ xScale }
          translate={ `translate(0, ${svg_dimensions.height - margin.bottom})` }
          tickSize={ ysize }
        />
        { ylabel && <text x={-ysize/2-parseInt(margin.top)}
          y={margin.left - 50}
          fontSize='12px'
          transform='rotate(-90)'
          textAnchor='middle'>{ylabel}</text> }
        <Axis
          orient='Left'
          scale={ yScale }
          translate={ `translate(${margin.left}, 0)` }
          tickSize={ xsize }
        />
        {
          plot_series.map((series, index) =>
              <SeriesComponent
                key={ index }
                series={series}
                index={index}
                count={plot_series.length}
                color={ labels[index].color }
                xScale={xScale}
                yScale={yScale}
                {...other_props}
              />
          )
        }
      </svg>
    </div>;
  }
}

