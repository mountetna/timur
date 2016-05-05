// this is a single div that will format a document to display the
// value for a single attribute

Attribute = React.createClass({
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
                    store.dispatch(magmaActions.reviseDocument(
                      self.props.document,
                      self.props.template,
                      self.props.attribute,
                      value)
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
Attribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = Attribute;
