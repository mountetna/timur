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
      var edit_link = this.state.new_link_value ? stable_links.pop() : null
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
                {
                  this.state.show_new_link ?
                  <div className="collection_item">
                    <input
                      type='text'
                      className="link_text" 
                      placeholder="New or existing ID"
                      onChange={
                          function(e) {
                            var value = e.target.value
                            var has_value = value && value.length
                            self.setState({ new_link_value: value })

                            // catch the first debounce for greater clarity
                            new_links = stable_links.concat(has_value ? value : [])

                            if (value && !edit_link)
                              self.props.reviseList( new_links )
                            else
                              self.update( new_links )
                          }
                      }
                      value={ this.state.new_link_value }
                      onBlur={
                        function(e) {
                          self.setState({ show_new_link: null, new_link_value: null })
                        }
                      }
                      />
                  </div>
                  :
                    null
                }
                <div className="collection_item">
                  <span className="add_item"
                    onClick={
                      function(e) {
                        self.setState({ show_new_link: true })
                      }
                    }>+</span>
                </div>
               </div>
             </div>
    }
    return <div className="value">
             <div className="collection">
              {
                links.map(
                  function(link) {
                    return <div key={ link } className="collection_item">
                      <MagmaLink link={ link } model={ self.props.attribute.model_name }/>
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
