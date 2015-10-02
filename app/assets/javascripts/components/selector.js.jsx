Selector = React.createClass({
  render: function() {
    var none_opt;
    if (this.props.showNone)
      none_opt = <option disabled key="none" value="none"> --- </option>;
    return <select name={ this.props.name } defaultValue={ this.props.defaultValue || this.props.values.first } onChange={ this.props.onChange } >
      { this.props.children }
      { none_opt }
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
