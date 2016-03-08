
var DocumentAttribute = React.createClass({
  render: function() {
    var link = this.props.value
    if (this.props.mode == "edit") {
      return <div className="value">
               <input type="file"/>
             </div>
    }
    if (link) {
      return <div className="value">
              <a href={ link.url } > { link.path } </a>
             </div>
    }
    return <div className="value"> <div className="document_empty">No file.</div> </div>
  }
});

module.exports = DocumentAttribute
