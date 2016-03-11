var CollectionList = React.createClass({
  getInitialState: function() {
    return { new_link_updated: false }
  },
  render: function() {
    var self = this
    var links = this.props.value || []
    if (this.props.mode == "edit") {
      var stable_links = this.props.revision.slice()
      var edit_link = this.state.new_link_updated ? stable_links.pop() : null
      return <div className="value">
               <div className="collection">
                {
                  stable_links.map(
                    function(link,i) {
                      return <div key={ i } className="collection_item">
                      <span className="delete_link"
                        onClick={
                          function(e) {
                            self.props.reviseList(
                              stable_links
                                .slice(0,i)
                                .concat(stable_links.slice(i+1))
                                .concat(edit_link ? edit_link : [] )
                            )
                          }
                        }
                      >{ link.identifier }</span>
                      </div>
                    })
                }
                <div className="collection_item">
                <input className="link_text" 
                  placeholder="New or existing ID"
                  onChange={
                    function(e) {
                      var value = e.target.value

                      self.props.reviseList(
                        stable_links.concat(
                          value && value.length ? {
                            identifier: value,
                            model: self.props.attribute.name
                          } : []
                        )
                      )

                      if (!value || !value.length)
                        self.setState({ new_link_updated: false })
                      else
                        self.setState({ new_link_updated: true })
                    }
                  }
                  onBlur={
                    function(e) {
                      self.setState({new_link_updated: false })
                    }
                  }
                  value={ edit_link ? edit_link.identifier : "" }
                  type="text"/>
                </div>
                { this.state.new_link_updated ? 
                    <div className="collection_item">
                      <input className="link_text"
                        placeholder="New or existing ID"
                        type="text"/>
                    </div>
                  : null }
               </div>
             </div>
    }
    return <div className="value">
             <div className="collection">
              {
                links.map(
                  function(link) {
                    return <div key={ link.identifier } className="collection_item">
                      <MagmaLink link={ link }/>
                      { link.summary ? <span> - { link.summary }</span> : null }
                    </div>
                  })
               }
             </div>
           </div>
  }
})

var CollectionAttribute = connect(
  function(state, ownProps) {
    return ownProps
  },
  function(dispatch,ownProps) {
    return {
      reviseList: function(newlist) {
        dispatch(
          magmaActions.reviseDocument(
            ownProps.document,
            ownProps.template,
            ownProps.attribute,
            newlist)
        )
      }
    }
  }
)(CollectionList);

CollectionAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = CollectionAttribute
