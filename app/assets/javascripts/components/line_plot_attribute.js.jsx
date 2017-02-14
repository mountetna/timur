var LinePlotAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit"
        || this.props.lines.some(function(line) { return line == null })
       ) return <div className="value"> </div>
    return <div className="value">
              <LinePlot
                ylabel={ this.props.attribute.plot.ylabel }
                xlabel={ this.props.attribute.plot.xlabel }
                plot={ 
                  {
                    width: 600,
                    height: 200,
                    margin: {
                      left: 60,
                      right: 90,
                      top: 10,
                      bottom: 40
                    }
                  } 
                } 
                lines={
                  this.props.lines
                }
              />
           </div>
  }
})

LinePlotAttribute = connect(
  function(state,props) {
    return {
      lines: props.attribute.plot.lines.map(function(line_config) {
        var table = state.magma.tables[line_config.table]

        if (!table) return null

        var matrix = new Matrix(table.matrix)

        var x = new Calculation(matrix, line_config.x)
        var y = new Calculation(matrix, line_config.y)

        var x_values = x.value()
        var y_values = y.value()

        var points = matrix.map_row(function(row,i) {
          if (x_values[i] == null || y_values[i] == null) return null
          return {
            x: x_values[i],
            y: y_values[i]
          }
        }).filter(function(point) { return point != null })

        return {
          label: line_config.label,
          color: line_config.color,
          points: points
        }
      })
    }
  },
  function(dispatch,props) {
    return props
  }
)(LinePlotAttribute)

module.exports = LinePlotAttribute
