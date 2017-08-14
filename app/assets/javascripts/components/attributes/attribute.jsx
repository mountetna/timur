import { reviseDocument } from '../../actions/magma_actions'

var Attribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
              <SlowTextInput textClassName="full_text" 
                waitTime={500}
                placeholder={ this.props.attribute.placeholder }
                update={
                  function(value) {
                    store.dispatch(reviseDocument(
                      self.props.document,
                      self.props.template,
                      self.props.attribute,
                      value)
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
Attribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = Attribute;
