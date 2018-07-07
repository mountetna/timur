import * as React from 'react';

import * as D3Scale from '../../../utils/d3_scale';
import Legend from '../legend';
import PlotCanvas from '../plot_canvas';
import YAxis from '../yaxis';

export default class BarPlot extends React.Component{
  constructor(props){
    super(props);
    this.state = { zoom: 1 };
  }

  onWheel(event) {
    let { zoom } = this.state;
    event.preventDefault();

    if (event.deltaY > 0) zoom = zoom * 0.8;
    else zoom = zoom * 1.2;
    if (zoom < 1e-6) zoom = 1e-6;
    if (zoom > 1) zoom = 1;

    this.setState({zoom});
  }
  render() {
    let { plot, model_name, ymin, ymax, legend, bars } = this.props;
    let { margin } = plot;

    let width = plot.width - margin.left - margin.right;
    let height = plot.height - margin.top - margin.bottom;

    let zoom_ymax = this.state.zoom * ymax;

    let yScale = D3Scale.createScale(
      [ ymin, zoom_ymax ],
      [ height, 0 ]
    );

    return <svg
      id={ plot.name }
      className="bar_plot"
      width={ plot.width }
      height={ plot.height }>
      <PlotCanvas
        onWheel={ this.onWheel }
        x={ margin.left } y={ margin.top }
        width={ width }
        height={ height }>
      <YAxis x={ -3 }
        scale={ yScale }
        ymin={ ymin }
        ymax={ zoom_ymax }
        num_ticks={5}
        tick_width={ 5 }/>
      <Legend x={ width - margin.right - 30 } y="0" series={ legend || bars }/>
      {
        // heights - all of the heights for this group 
        // select - the height index we want to draw special (as a bar)
        // highlight - the highlight name of the currently-moused item
        // highlight_names - the list of highlight names for all items - all
        //     items with the same highlight_name will light up.
        // category - class/category names for the items
        bars.map(
          (bar,i) => <BarPlotBar key={ i }
             model_name={ model_name }
             name={ bar.name }
             color={ bar.color }
             heights={ bar.heights }
             select={ bar.select }
             similar={ bar.similar }
             category={ bar.category }
             highlight_names={ bar.highlight_names }
             ymax={ zoom_ymax }
             ymin={ ymin }
             width={ 20 }
             scale={ yScale }
             x={ 10 + i * 30 }
             mouse_handler={
               (name) => this.setState({ highlighted_name: name })
             }
             highlighted_name={ this.state.highlighted_name } />
        )
      }
      </PlotCanvas>
    </svg>;
  }
}

export class BarPlotBar extends React.Component{
  render() {
    let {
      model_name, heights, x, scale, width, ymin, ymax, color, similar,
      highlight_names, highlighted_name, category, mouse_handler, select 
    } = this.props;

    return <g className="bar">
      {
        heights.map( (name,height,i) => {
          if (height == null) return null;

          if (select == i) {
            return <rect key={i}
              x={ x }
              y={ scale( height ) - scale(ymax) }
              width={ width }
              style={ { stroke: (color || 'white') } }
              height={ scale(ymin) - scale( height ) }/>;
          }
          else {
            return <Dot key={i}
              model_name={ model_name }
              category={ category ? category(i) : null }
              similar={ similar ? similar[i] : null }
              name={ name } 
              mouse_handler={ mouse_handler }
              x={ x + width / 2  + ((1000*height) %8) - 4} 
              y={ scale(height) }
              highlighted={ highlight_names[i] == highlighted_name }
              highlight_name={ highlight_names[i] }
             />;
          }
        })
      }
      <text textAnchor="start" 
        transform={ 
          'translate('+x+',' +
              (scale(ymin) + 15)+') rotate(45)'
        }>
        { name }
      </text>
    </g>;
  }
}

export class Dot extends React.Component{
  constructor() {
    super();
    this.state = { highlighted: false };
  }
  render() {
    let { highlighted, category, similar, model_name, name, highlight_name, mouse_handler, x, y } = this.props;
    let classes = [
      'dot',
      category,
      highlighted && 'highlighted',
      similar && 'similar'
    ].filter(_=>_).join(' ');

    return <a xlinkHref={
      Routes.browse_model_path(TIMUR_CONFIG.project_name, model_name, name)
    }>
        <circle className={classes}
          onMouseOver={
            (event) => {
              this.setState({ highlighted: true });
              mouse_handler(highlight_name);
            }
          }
          onMouseOut={
            (event) => {
              this.setState({highlighted: false});
              mouse_handler(null);
            }
          }
          r="2.5"
          cx={ x }
          cy={ y }
          />
        {
          this.state.highlighted ?
          <text className="tooltip" textAnchor="start" 
            transform={ 'translate(' + (x + 5) + ',' + y + ')' }>
            { name }
          </text> : null
        }
      </a>;
  }
}
