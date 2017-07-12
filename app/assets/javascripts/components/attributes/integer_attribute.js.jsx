import { reviseDocument } from '../../actions/magma_actions'

var IntegerAttribute = React.createClass({
  filter_keys: function(e) {
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e) || Keycode.match(e,/^_$/)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render: function() {

    var self = this
    var store = this.context.store

    if (this.props.mode == 'edit') {
      return <div className="value">
              <SlowTextInput 
                textClassName="full_text" 
                placeholder={this.props.attribute.placeholder}
                onKeyPress={ this.filter_keys }
                update={
                  function(value) {
                    store.dispatch(
                      reviseDocument(
                        self.props.document,
                        self.props.template,
                        self.props.attribute,
                        value.replace(/_/,'')
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
IntegerAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = IntegerAttribute
