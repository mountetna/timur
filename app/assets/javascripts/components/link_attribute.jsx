var LinkAttribute = React.createClass({
  render: function() {
    var link = this.props.value

    if (this.props.mode == "edit") {
      if (link) {
        return <div className="value" onClick={ this.props.deleteLink } >
          <span className="delete_link">{ link.identifier }</span>
          </div>
      }
      return <div>
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

module.exports = LinkAttribute
