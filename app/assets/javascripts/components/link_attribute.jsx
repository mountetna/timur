var LinkAttribute = React.createClass({
  update: function(value) {
    var store = this.context.store
    store.dispatch(magmaActions.reviseDocument(
      this.props.document,
      this.props.template,
      this.props.attribute,
      value)
    )
  },
  componentWillMount: function() {
    this.update = $.debounce(500,this.update);
  },
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
                <input type='text' 
                  className="link_text" 
                  onChange={ 
                    function(e) {
                      self.update(e.target.value)
                    }
                  }
                  placeholder="New or existing ID"/> 
             </div>
    }
    if (link) {
      return <div className="value">
              <MagmaLink link={link} model={ this.props.template.name } />
             </div>
    }
    return <div className="value"/>
  }
})
LinkAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = LinkAttribute
