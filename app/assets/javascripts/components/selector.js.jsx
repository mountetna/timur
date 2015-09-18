Selector = React.createClass({
  render: function() {
    return <select name={ this.props.name } defaultValue={ this.props.defaultValue } onChange={ this.props.onChange } >
      { this.props.children }
      {
        this.props.values.map(function(v) {
          if ($.isPlainObject(v))
            return <option key={v.key} value={v.value}>{ v.text }</option>;
          else
            return <option key={v} value={v}>{ v }</option>;
        })
      }
    </select>
  }
});
