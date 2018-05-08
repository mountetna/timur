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
    var zoom = this.state.zoom
    event.preventDefault()

    if (event.deltaY > 0)
      zoom = zoom * 0.8
    else
      zoom = zoom * 1.2
    if (zoom < 1e-6)
      zoom = 1e-6
    if (zoom > 1)
      zoom = 1
    this.setState({ zoom: zoom })
  }
  render() {
    var plot = this.props.plot
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom

    var zoom_ymax = this.state.zoom * this.props.ymax

    var yScale = D3Scale.createScale(
      [ this.props.ymin, zoom_ymax ],
      [ height, 0 ]
    )

    return <svg 
      id={ this.props.plot.name }
      className="bar_plot" 
      width={ this.props.plot.width }
      height={ this.props.plot.height }>
      <PlotCanvas
        onWheel={ this.onWheel }
        x={ margin.left } y={ margin.top }
        width={ width }
        height={ height }>
      <YAxis x={ -3 }
        scale={ yScale }
        ymin={ this.props.ymin }
        ymax={ zoom_ymax }
        num_ticks={5}
        tick_width={ 5 }/>
      <Legend x={ width - margin.right - 30 } y="0" series={ this.props.legend || this.props.bars }/>
      {
        // heights - all of the heights for this group 
        // select - the height index we want to draw special (as a bar)
        // highlight - the highlight name of the currently-moused item
        // highlight_names - the list of highlight names for all items - all
        //     items with the same highlight_name will light up.
        // category - class/category names for the items
        this.props.bars.map(
          (bar,i) => <BarPlotBar key={ i }
             name={ bar.name }
             color={ bar.color }
             ymax={ zoom_ymax }
             ymin={ this.props.ymin }
             width={ 20 }
             scale={ yScale }
             x={ 10 + i * 30 }
             heights={ bar.heights }
             select={ bar.select }
             similar={ bar.similar }
             mouse_handler={
               (name) => this.setState({ highlighted_name: name })
             }
             category={ bar.category }
             highlighted_name={ this.state.highlighted_name }
             highlight_names={ bar.highlight_names } />
        )
      }
      </PlotCanvas>
    </svg>
  }
}

export class BarPlotBar extends React.Component{
  render() {
    var props = this.props

    return <g className="bar">
      {
        props.heights.map( (name,height,i) => {
          if (height == null) return null

          if (props.select != null && props.select == i)
            return <rect key={i}
              x={ props.x }
              y={ props.scale( height ) - props.scale(props.ymax) }
              width={ props.width }
              style={ { stroke: (props.color || "white") } }
              height={ props.scale(props.ymin) - props.scale( height ) }/>
          else
            return <Dot key={i} 
              category={ props.category ? props.category(i) : null }
              similar={ props.similar ? props.similar[i] : null }
              name={ name } 
              mouse_handler={ props.mouse_handler }
              x={ props.x + props.width / 2  + ((1000*height) %8) - 4} 
              y={ props.scale(height) }
              highlighted={ props.highlight_names[i] == props.highlighted_name }
              highlight_name={ props.highlight_names[i] }
             />
        })
      }
      <text textAnchor="start" 
        transform={ 
          'translate('+props.x+',' +
              (props.scale(props.ymin) + 15)+') rotate(45)'
        }>
        { props.name }
      </text>
    </g>
  }
}

export class Dot extends React.Component{
  constructor() {
    super();
    this.state = { highlighted: false };
  }
  render() {
    let { highlighted, category, similar, name, highlight_name, mouse_handler, x, y } = this.props;
    var classes = [
      'dot',
      category,
      highlighted && 'highlighted',
      similar && 'similar'
    ].filter(_=>_).join(' ');

    return <a xlinkHref={ Routes.browse_model_path('sample', name) }>
        <circle className={classes}
          onMouseOver={
            (event) => {
              this.setState({ highlighted: true })
              mouse_handler(highlight_name) 
            }
          }
          onMouseOut={
            (event) => {
              this.setState({highlighted: false})
              mouse_handler(null)
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
      </a>
  }
}
