var BoxPlotAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit" || this.props.groups.length == 0)
      return <div className="value"> </div>

    return <div className="value">
      <BoxPlot
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
        groups={
          this.props.groups
        }
        ymin={0}
        ymax={1}
      />
    </div>
  },
})

BoxPlotAttribute.contextTypes = {
  store: React.PropTypes.object
}

BoxPlotAttribute = connect(
  function(state,props) {
    var table = state.magma.tables[ props.attribute.plot.name ]

    var groups = {}
    if (table) {
      var matrix = new Matrix(table.matrix)
      var cat = matrix.col_index(props.attribute.plot.category)
      var calc = new Calculation(matrix, props.attribute.plot.value)
      var values = calc.value()
      matrix.map_row(function(row,i,row_name) {
        if (values[i] != null && !isNaN(values[i])) {
          groups[row[cat]] = groups[row[cat]] || []
          groups[row[cat]].push( values[i] )
        }
      })
    }

    var colors = autoColors(Object.keys(groups).length)
    return {
      groups: Object.keys(groups).map(function(name,i) {
        return {
          name: name,
          color: colors[i],
          values: groups[name]
        }
      })
    }
  }
)(BoxPlotAttribute)

module.exports = BoxPlotAttribute
