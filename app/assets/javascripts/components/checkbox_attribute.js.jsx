var CheckboxAttribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
              <input type="checkbox" className="text_box" 
                onChange={
                  function(e) {
                    store.dispatch(
                      magmaActions.reviseDocument(
                        self.props.document,
                        self.props.template,
                        self.props.attribute,
                        e.target.checked ? true : false
                      )
                    )
                  }
                }
                defaultChecked={ this.props.revision } />
             </div>
    }
    return <div className="value"> { this.props.value ? "yes" : "no" } </div>
  }
})
CheckboxAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = CheckboxAttribute
