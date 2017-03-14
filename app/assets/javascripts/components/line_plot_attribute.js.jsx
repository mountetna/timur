var LinePlotAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit"
        || this.props.lines.length == 0
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
    var manifest = timurActions.findManifest(state,props.attribute.plot.name)

    var lines = []

    if (manifest && manifest.lines) {
      var colors = autoColors(manifest.lines.length)
      lines = manifest.lines.map(
        ([label, line],i) => ({
          label: label,
          color: colors[i],
          points: line.map(([identifier, x_val],j) => ({
            label: identifier,
            x: x_val,
            y: manifest.y[i][1][j][1]
          })).filter((point) => point.x != null && point.y != null)
        })
      )
    }

    console.log(lines)

    return {
      lines: lines
    }
  },
  function(dispatch,props) {
    return props
  }
)(LinePlotAttribute)

module.exports = LinePlotAttribute
