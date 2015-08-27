SelectAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <select name={ this.value_name() } className="selection" defaultValue={ this.attribute_value() }>
            {
              this.props.attribute.options.map(
                function(name) {
                    return <option key={name} value={name}>{ name }</option>;
                  }
                )
            }
            </select>
           </div>
  }
})
