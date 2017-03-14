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
    var manifest = state.timur.manifests[ props.attribute.plot.name ]

    var bars = []

    if (manifest && manifest.heightle) {
      bars = manifest.height.map((height, i) => ({
          name: bar.name,
          color: bar.color,
          height: heights[0],
          dots: [],
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
