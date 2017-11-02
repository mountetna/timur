import { reviseDocument } from '../../actions/magma_actions'
import SelectInput from '../inputs/select_input';

var SelectAttribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
              <SelectInput 
                className="selection"
                onChange={
                  function(value) {
                    store.dispatch(reviseDocument(
                      self.props.document,
                      self.props.template,
                      self.props.attribute,
                      value)
                    )
                  }
                }
                defaultValue={ this.props.value }
                showNone="disabled"
                values={ this.props.attribute.options } />
             </div>
    }
    return <div className="value">
            { this.props.value }
           </div>
  }
})
SelectAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = SelectAttribute
