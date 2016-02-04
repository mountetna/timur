SelectAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <Selector name={ this.value_name() } className="selection" defaultValue={ this.attribute_value }
              values={ this.props.attribute.options } />
           </div>
  }
})

module.exports = SelectAttribute;
