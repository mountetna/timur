
Attribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" placeholder={ this.props.attribute.placeholder } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
});

module.exports = Attribute;
