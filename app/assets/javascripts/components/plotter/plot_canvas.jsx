// Framework libraries.
import * as React from 'react';

export default class PlotCanvas extends React.Component{
  render() {
    return <g className="plot_canvas" 
            onWheel={ this.props.onWheel }
            transform={ 'translate(' + this.props.x + ',' + this.props.y + ')' }>
              <rect x="0" y="0" width={ this.props.width }
                height={ this.props.height }
                style={ { fill: 'white' } }/>
      {
        this.props.children
      }
    </g>
  }
}
