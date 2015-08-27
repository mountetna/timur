IntegerAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  filter_keys: function(e) {
    console.log("blah");
    console.log(e);
    if (Keycode.is_modified(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" placeholder={this.props.attribute.placeholder} onKeyDown={ this.filter_keys } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
})
