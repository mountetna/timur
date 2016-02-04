BarPlotAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
              <BarPlot
                ymin={ 0 }
                ymax={ 1 }
                legend={ this.attribute_value().legend }
                plot={ this.attribute_value().plot }
                data={ this.attribute_value().data } />
           </div>
  },
  render_edit: function() {
    return <div className="value">
           </div>
  },
});

module.exports = BarPlotAttribute;
