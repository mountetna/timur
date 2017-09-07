import { reviseDocument } from '../../actions/magma_actions'

var FloatAttribute = React.createClass({
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
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
        <SlowTextInput
          placeholder={this.props.attribute.placeholder} 
          textClassName="full_text" 
          onKeyPress={ this.filter_keys } 
          update={
            function(value) {
              store.dispatch(
                reviseDocument(
                  self.props.document,
                  self.props.template,
                  self.props.attribute,
                  parseFloat(value)
                )
              )
            }
          }
          defaultValue={ this.props.revision } />
      </div>
    }
    return <div className="value">
            { this.props.value }
           </div>
  }
})

FloatAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = FloatAttribute;
