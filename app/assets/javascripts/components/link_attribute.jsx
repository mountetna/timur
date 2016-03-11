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
              store.dispatch(magmaActions.reviseDocument(
                self.props.document,
                self.props.template,
                self.props.attribute,
                null))
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
