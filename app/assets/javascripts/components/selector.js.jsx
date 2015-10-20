Selector = React.createClass({
  render: function() {
    var none_opt;
    console.log(this.props.defaultValue);
    if (this.props.showNone == "disabled")
      none_opt = <option disabled key="none" value="none"> --- </option>;
    else if (this.props.showNone == "enabled")
      none_opt = <option key="none" value="none"> --- </option>;
    return <select name={ this.props.name } defaultValue={ this.props.defaultValue || (this.props.showNone ? 'none' : null) } onChange={ this.props.onChange } >
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
