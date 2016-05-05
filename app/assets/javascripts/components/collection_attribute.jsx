var CollectionList = React.createClass({
  getInitialState: function() {
    return { new_link_updated: false }
  },
  update: function(new_links) {
    this.props.reviseList( new_links )
  },
  componentWillMount: function() {
    this.update = $.debounce(200,this.update);
  },
  render: function() {
    var self = this
    var links = this.props.value || []
    if (this.props.mode == "edit") {
      var stable_links = (this.props.revision || []).slice()
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
                      >{ link }</span>
                      </div>
                    })
                }
                <div className="collection_item">
                <input
                  type='text'
                  className="link_text" 
                  placeholder="New or existing ID"
                  onChange={
                      function(e) {
                        var value = e.target.value
                        var has_value = value && value.length
                        self.setState({ new_link_updated: has_value, new_link_value: value })
                        if (has_value) self.update(stable_links.concat(value))
                      }
                  }
                  value={ this.state.new_link_value }
                  onBlur={
                    function(e) {
                      self.setState({new_link_updated: false, new_link_value: null })
                    }
                  }
                  />
                </div>
                {
                  this.state.new_link_updated ? 
                    <div className="collection_item">
                      <input className="link_text"
                        placeholder="New or existing ID"
                        type="text"/>
                    </div>
                  : null 
                }
               </div>
             </div>
    }
    return <div className="value">
             <div className="collection">
              {
                links.map(
                  function(link) {
                    return <div key={ link } className="collection_item">
                      <MagmaLink link={ link } model={ self.props.attribute.name }/>
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
