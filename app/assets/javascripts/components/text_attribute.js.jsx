TextAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <textarea className="text_box" name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
});
