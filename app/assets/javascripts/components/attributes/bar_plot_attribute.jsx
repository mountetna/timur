import React, { Component } from 'react';

import { connect } from 'react-redux';

import { selectConsignment } from '../../selectors/consignment'

var BarPlotAttribute = React.createClass({
  render: function() {
    return <div className="value">
              <BarPlot
                ymin={ 0 }
                ymax={ 1 }
                legend={ this.props.legend }
                plot={ 
                  this.props.plot || {
                    width: 900,
                    height: 200,
                    margin: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 40
                    }
                  }
                }
                bars={ this.props.bars } />
           </div>
  },
})

BarPlotAttribute = connect(
  function(state,props) {
    var consignment = selectConsignment(state,props.attribute.plot.name)

    var bars = []

    if (consignment && consignment.bars) {
      bars = consignment.bars.map((_, bar, i) => ({
          name: bar("name"),
          color: bar("color"),
          heights: bar("height"),
          category: bar("category"),
          highlight_names: bar("highlight_names") ? bar("highlight_names").values : bar("height").labels,
          select: bar("select").which((value) => value)[0],
          similar: bar("similar") ? bar("similar").values : undefined
        })
      )
    }

    return {
      bars: bars,
      legend: props.attribute.plot.legend,
      plot: props.attribute.plot.dimensions
    }
  }
)(BarPlotAttribute)

module.exports = BarPlotAttribute
