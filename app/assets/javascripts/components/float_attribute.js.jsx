FloatAttribute = React.createClass({
  filter_keys: function(e) {
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.match(e,/^[\.e\-]$/)) return true
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render: function() {
    var self = this
    if (this.props.mode == "edit") {
      return <div className="value">
        <input
          type='text' 
          placeholder={this.props.attribute.placeholder} 
          className="full_text" 
          onKeyPress={ this.filter_keys } 
          onChange={
            function(e) {
              store.dispatch(
                magmaActions.reviseDocument(
                  self.props.document,
                  self.props.template,
                  self.props.attribute,
                  parseFloat(e.target.value)
                )
              )
            }
          }
          defaultValue={ this.props.value } />
      </div>
    }
    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = FloatAttribute;
