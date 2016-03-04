CollectionAttribute = React.createClass({
  even_newer_link: function() {
  },
  render: function() {
    var self = this;
    var links = this.props.value || []
    if (this.props.mode == "edit") {
      return <div className="value">
               <div className="collection">
                {
                  links.map(
                    function(link,i) {
                      return <div key={ i } className="collection_item">
                      <span className="delete_link">{ link.identifier }</span>
                      </div>
                    })
                }
                <div className="collection_item">
                <input className="link_text" 
                  placeholder="New or existing ID"
                  onChange={ function(e) {
                      self.setState({ new_link_text: e.target.value })
                    } }
                  type="text"/>
                { this.even_newer_link() }
                </div>
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

module.exports = CollectionAttribute
