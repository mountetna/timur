var LinkAttribute = React.createClass({
  render: function() {
    var link = this.props.value
    var self = this
    var store = this.context.store

    if (this.props.mode == "edit") {
      link = this.props.revision
      if (link && link == this.props.value) {
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
          >{ link }</span>
          </div>
      }
      return <div className="value">
                <SlowTextInput 
                  textClassName="link_text" 
                  waitTime={500}
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
                  placeholder="New or existing ID"/>
             </div>
    }
    if (link) {
      return <div className="value">
              <MagmaLink link={link} model={ this.props.attribute.model_name } />
             </div>
    }
    return <div className="value"/>
  }
})
LinkAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = LinkAttribute
