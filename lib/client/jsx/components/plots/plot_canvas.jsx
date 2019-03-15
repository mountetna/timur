// Framework libraries.
import * as React from 'react';
import * as d3 from 'd3';
import Axis from './axis';
import Legend from './legend';

// The PlotCanvas renders the svg pane and determines
// its width, etc.


export default class PlotCanvas extends React.Component {
  scale(domain, range) {
    let s = domain[0] instanceof Date ? d3.scaleTime() :
      typeof domain[0] === 'string' ? d3.scaleBand().padding(.2) :
      d3.scaleLinear();

    s = s.domain(domain).range(range);
    if (s.nice) s = s.nice();

    return s;
  }

  render() {
    let { layout, parent_width, xdomain, ydomain, plot_series, component, className } = this.props;
    let { margin } = layout;

    let defaultColor = d3.scaleOrdinal(d3.schemeCategory10);

    let labels = plot_series.map(({name, variables: { color }}) => (
      {
        color: color || defaultColor(name),
        text: name
      }
    ));

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
    console.log(svg_dimensions);
    console.log("Xscale has domain", xScale.domain(), "and range", xScale.range() );
    console.log("Yscale has domain", yScale.domain(), "and range", yScale.range() );

    let SeriesComponent = component;

    return <div className={ className }>
      <Legend width={ svg_dimensions.width } labels={labels} />
      <svg
        width={ svg_dimensions.width }
        height={ svg_dimensions.height }>
        <Axis
          orient='Bottom'
          scale={ xScale }
          translate={ `translate(0, ${svg_dimensions.height - margin.bottom})` }
          tickSize={ svg_dimensions.height - margin.top - margin.bottom }
        />
        <Axis
          orient='Left'
          scale={ yScale }
          translate={ `translate(${margin.left}, 0)` }
          tickSize={ svg_dimensions.width - margin.left - margin.right }
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
              />
          )
        }
      </svg>
    </div>;
  }
}

