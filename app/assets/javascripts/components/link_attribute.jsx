var LinkAttribute = React.createClass({
  render: function() {
    var link = this.props.value
    var store = this.context.store
    var self = this

    if (this.props.mode == "edit") {
      link = this.props.revision
      if (link) {
        return <div className="value">
          <span className="delete_link"
          onClick={
            function(e) {
              var revision = {}
              revision[ self.props.attribute.name ] = null
              store.dispatch(magmaActions.reviseDocument(
                self.props.document.name,
                self.props.template.name,
                revision))
            }
          }
          >{ link.identifier }</span>
          </div>
      }
      return <div className="value">
                <input type='text' 
                  className="link_text" 
                  placeholder="New or existing ID"/> 
             </div>
    }
    if (link) {
      return <div className="value">
              <MagmaLink link={link}/>
             </div>
    }
    return <div className="value"/>
  }
})
LinkAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = LinkAttribute
