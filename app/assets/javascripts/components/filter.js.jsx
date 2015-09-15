Filter = React.createClass({
  render: function() {
    return <div className="filter">
          Indication:  { this.var_select('indication', this.props.indications) }
        </div>;
  },
  var_select: function(name, values) {
    return <select name={ name }>
      {
        values.map(function(v) {
          return <option key={v} value={v} >{ v }</option>;
        })
      }
    </select>
  }
})
