// this is a single div that will format a document to display the
// value for a single attribute

Attribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
              <input type='text' className="full_text" 
                placeholder={ this.props.attribute.placeholder }
                onChange={ function(e) {
                  var text = e.target.value
                  var revision = { }
                  revision[ self.props.attribute.name ] = text
                  store.dispatch(magmaActions.reviseDocument(
                    self.props.document.name,
                    self.props.template.name,
                    revision))
                } }
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
