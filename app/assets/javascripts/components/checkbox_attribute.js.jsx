CheckboxAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    if (this.attribute_value())
      check = "yes";
    else
      check = "no";
    return <div className="value">
            { check }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type="hidden" name={ this.value_name() } value="0" />
            <input type="checkbox" className="text_box" name={ this.value_name() } defaultChecked={ this.attribute_value() } />
           </div>
  }
})

module.exports = CheckboxAttribute;
