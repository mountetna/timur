SelectAttribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
              <Selector 
                className="selection"
                onChange={
                  function(value) {
                    store.dispatch(magmaActions.reviseDocument(
                      self.props.document,
                      self.props.template,
                      self.props.attribute,
                      value)
                    )
                  }
                }
                defaultValue={ this.props.value }
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
