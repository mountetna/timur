// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as D3Scale from '../../../utils/d3_scale';
import PlotCanvas from '../plot_canvas';

export default class BoxPlot extends React.Component{
  render() {
    var self = this
    var plot = this.props.plot
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom
    var groups = this.props.groups.filter(function(group) {
      return group.values.length > 1
    })

    var values = groups.reduce(
      (values, group) => values.concat(group.values),
      []
    )

    var yScale = D3Scale.createScale(
      [ this.props.ymin, this.props.ymax ],
      [ height, 0 ]
    )

    var boxwidth = width / groups.length

    return <svg 
      id={ this.props.plot.name }
      className="box_plot" 
      width={ plot.width }
      height={ plot.height } >
      <PlotCanvas
        x={ margin.left } y={ margin.top }
        width={ width }
        height={ height }>
        {
          groups.map(function(group,i) {
            return <WhiskerBox 
              key={i} 
              x={ boxwidth*(i + 1/2) - 10 }
              label={ group.name }
              values={group.values} 
              width={ 20 }
              color={group.color}
              scale={ yScale }/>
          })
        }
      </PlotCanvas>
    </svg>
  }
}

export class WhiskerBox extends React.Component{

  quantile(values, p) {
    if ( p == 0.0 ) { return values[ 0 ] }
    if ( p == 1.0 ) { return values[ values.length-1 ] }
    var id = values.length*p- 1
    if ( id == Math.floor( id ) ) {
      return ( values[ id ] + values[ id+1 ] ) / 2.0
    }
    id = Math.ceil( id )
    return values[ id ]
  }

  render() {
    // 
    var self = this

    var values = this.props.values.sort(function(a,b) { return a-b })

    var quartileData = [
      this.quantile(values, 0.25),
      this.quantile(values, 0.5),
      this.quantile(values, 0.75)
    ]

    var iqr = (quartileData[2] - quartileData[0]) * 1.5

    var whiskerMin = values.find(function(value) {
      return value >= quartileData[0] - iqr
    })

    var whiskerMax = values.reverse().find(function(value) {
      return value <= quartileData[2] + iqr
    })
    
    var outliers = values.filter(function(value) {
      return value < whiskerMin  || value > whiskerMax
    })

    return <g className="whisker_box"
      transform={ "translate("+this.props.x+",0)"}>
      <line className="center"
        x1={ this.props.width / 2 }
        x2={ this.props.width / 2 }
        y1={ this.props.scale(whiskerMin) }
        y2={ this.props.scale(whiskerMax) }
        />

      <rect className="box"
        x={ 0 }
        y={ this.props.scale(quartileData[2]) }
        width={ this.props.width }
        height={ this.props.scale(quartileData[0]) - this.props.scale(quartileData[2])}
        style={ { stroke: this.props.color } }
        />
      {
        quartileData.map(function(amt,i) {
          return <text key={i} 
            className="box"
            dy=".3em"
            dx={ i & 1 ? 6 : -6 }
            x={ i & 1 ? self.props.width : 0 }
            y={ self.props.scale(amt) }
            textAnchor={ i & 1 ? "start" : "end" }>
            { amt.toFixed(2) }
            </text>
        })
      }
      <line className="median"
        x1={ 0 }
        x2={ this.props.width }
        y1={ this.props.scale(quartileData[1]) } 
        y2={ this.props.scale(quartileData[1]) } 
        style={ { stroke: this.props.color } }
        />

      <line className="whisker"
        x1={ 0 }
        x2={ this.props.width }
        y1={ this.props.scale(whiskerMin) }
        y2={ this.props.scale(whiskerMin) }
        style={ { stroke: this.props.color } }
        />
      <line className="whisker"
        x1={ 0 }
        x2={ this.props.width }
        y1={ this.props.scale(whiskerMax) }
        y2={ this.props.scale(whiskerMax) }
        style={ { stroke: this.props.color } }
        />

      {
        outliers.map(function(outlier,i) {
          return <circle key={i} className="outlier"
            r="2"
            cx={ self.props.width / 2 }
            cy={ self.props.scale(outlier) }
            />
        })
      }
      <text className="label"
        x={ this.props.width / 2 }
        y={ this.props.scale(0) + 20 }
        textAnchor="middle">{ this.props.label }</text>
    </g>
  }
}
