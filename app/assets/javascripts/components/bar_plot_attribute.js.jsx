var BarPlotAttribute = React.createClass({
  render: function() {
    return <div className="value">
              <BarPlot
                ymin={ 0 }
                ymax={ 1 }
                legend={ this.props.legend }
                plot={ 
                  {
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
    var table = state.magma.tables[ props.attribute.plot.query.name ]

    var bars = [] 

    if (table) {
      var matrix = new Matrix(table.matrix)

      bars = props.attribute.plot.bars.map(function(bar) {
        var calc = new Calculation(matrix, bar.height)
      })
    }
  }
)

module.exports = BarPlotAttribute
