// Framework libraries.
import * as React from 'react';

export default class Legend extends React.Component{
  render(){
    return <g className="legend" height="100" width="100" 
       transform={ 'translate(' + this.props.x + ',' + this.props.y + ')' }>
      {
        this.props.series.map(function(series,i) {
          return <g key={i}>
            <rect x="0" y={ 10 + i * 20 }
              width="10" height="10"
              style={{fill: series.color }}/>
            <text textAnchor="start"
              x="15"
              y={ 20 + i * 20 }>
              { series.name }
            </text>
          </g>
        })
      }
    </g>
  }
}
