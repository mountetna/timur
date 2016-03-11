var TextAttribute = React.createClass({
  render: function() {
    var store = this.context.store
    var self = this
    if (this.props.mode == "edit") {
      return <div className="value">
              <textarea className="text_box" 
                onChange={
                  function(e) {
                    store.dispatch(
                      magmaActions.reviseDocument(
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
    return <div className="value">
            { this.props.value }
           </div>
  }
})
TextAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = TextAttribute
