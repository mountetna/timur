FloatAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  filter_keys: function(e) {
    console.log("blah");
    console.log(e.key);
    console.log(e.keyCode);
    console.log(e.charCode);
    console.log(e.which);
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.match(e,/^[\.e\-]$/)) return true
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' placeholder={this.props.attribute.placeholder} className="full_text" onKeyPress={ this.filter_keys } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
})

module.exports = FloatAttribute;
