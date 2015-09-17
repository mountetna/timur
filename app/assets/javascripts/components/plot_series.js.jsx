PlotSeries = React.createClass({
  render_indication: function() {
    if (!this.props.series) return <span>undefined</span>;
    return <span> Indication: { this.props.series.indication }</span>;
  },
  render: function() {
    if (this.props.mode == 'plot')
      return <div className="series">
          <span className="title">Series</span>
          { this.render_indication() }
        </div>;
    else
      return <div className="series edit">
            <span className="title">Series</span>
            Indication: { this.var_select('indication', this.props.template.indications, this.props.series ? this.props.series.indication : "none") }
          </div>;
  },
  update_series: function() {
    var node = $(React.findDOMNode(this));
    this.props.update_series({
      indication: node.find('select[name=indication]').val()
    });
  },
  var_select: function(name, values, def_value) {
    return <select name={ name } onChange={ this.update_series } defaultValue={ def_value }>
      <option disabled key="none" value="none"> --- </option>
      {
        values.map(function(v) {
          return <option key={v} value={v} >{ v }</option>;
        })
      }
    </select>
  }
})
