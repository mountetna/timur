import React, { Component } from 'react';

var Tooltip = React.createClass({
  render: function() {
    var self = this;
    var max_char_width = Math.max.apply(null, 
      Object.keys(this.props.display).map(function(name) {
        return name.length + self.props.display[name].toString().length;
      })
    );
    return <g className="tooltip" transform={ 'translate('
                        + (this.props.x+25)
                        + ','
                        + (this.props.y+25)
                        + ')' }>
      <rect x="0" y="0" 
        width={ (max_char_width+2)*7.5+2 }
        height={ 15 * Object.keys(self.props.display).length }/>
      {
        Object.keys(this.props.display).map(function(name, i) {
          var value = self.props.display[name];
          return <text key={i} textAnchor="start" transform={ 'translate('
                            + (1)
                            + ','
                            + (11+i*15)
                            + ')' }>
            {name + ': ' + value}
          </text>
        })
      }
    </g>
  }
})

module.exports = Tooltip
