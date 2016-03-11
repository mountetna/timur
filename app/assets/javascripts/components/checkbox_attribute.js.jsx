var CheckboxAttribute = React.createClass({
  render: function() {
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
                        e.target.value
                      )
                    )
                  }
                }
                defaultChecked={ this.props.value } />
             </div>
    }
    return <div className="value"> { this.props.value ? "yes" : "no" } </div>
  }
})
CheckboxAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = CheckboxAttribute
