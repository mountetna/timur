import { reviseDocument } from '../actions/magma_actions'
import markdown from '../markdown'

var MarkdownAttribute = React.createClass({
  render: function() {
    var store = this.context.store
    var self = this
    if (this.props.mode == "edit") {
      return <div className="value">
              <textarea className="text_box" 
                onChange={
                  function(e) {
                    store.dispatch(
                      reviseDocument(
                        self.props.document,
                        self.props.template,
                        self.props.attribute,
                        e.target.value
                      )
                    )
                  }
                }
                defaultValue={ this.props.revision } />
             </div>
    }

    if (!this.props.value)
      return <div className="value"/>

    var content = markdown(this.props.value)
    return <div className="value"
        dangerouslySetInnerHTML={ { __html: content } }/>
  }
})

MarkdownAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = MarkdownAttribute
