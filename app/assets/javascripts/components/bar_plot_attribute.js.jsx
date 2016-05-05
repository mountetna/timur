var BarPlotAttribute = React.createClass({
  render: function() {
    return <div className="value">
              <BarPlot
                ymin={ 0 }
                ymax={ 1 }
                legend={ this.props.value.legend }
                plot={ this.props.value.plot }
                data={ this.props.value.data } />
           </div>
  },
})

module.exports = BarPlotAttribute
